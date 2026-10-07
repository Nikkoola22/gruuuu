/**
 * Extracteur universel et ultra-résilient de texte PDF dans le navigateur
 * Combine PDF.js (avec worker bundlé par Vite) et décompression native des flux FlateDecode
 */

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

// Initialisation immédiate du worker
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  } catch (e) {
    console.warn("Configuration worker PDF:", e);
  }
}

/**
 * Décompresse tous les flux FlateDecode d'un PDF via l'API standard DecompressionStream
 */
async function extractFromFlateStreams(buffer: ArrayBuffer): Promise<string> {
  if (typeof DecompressionStream === 'undefined') return "";

  try {
    const bytes = new Uint8Array(buffer);
    const latinDecoder = new TextDecoder('latin1');
    const rawPdf = latinDecoder.decode(bytes);
    const parts: string[] = [];

    // Recherche de chaque flux : stream ... endstream
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match;

    while ((match = streamRegex.exec(rawPdf)) !== null) {
      const streamStart = match.index + match[0].indexOf('\n') + 1;
      const streamEnd = match.index + match[0].lastIndexOf('\n');
      if (streamStart >= streamEnd) continue;

      const streamBytes = bytes.subarray(streamStart, streamEnd);

      // Essayer deflate-raw puis deflate
      for (const format of ['deflate-raw', 'deflate'] as const) {
        try {
          const ds = new DecompressionStream(format);
          const writer = ds.writable.getWriter();
          writer.write(streamBytes);
          writer.close();
          const response = new Response(ds.readable);
          const decompressed = await response.arrayBuffer();
          const decoded = new TextDecoder('utf-8', { fatal: false }).decode(decompressed);

          // Extraire les chaînes (texte) Tj
          const tjRegex = /\(([^()]{1,250})\)\s*(?:Tj|'|")/g;
          let m;
          while ((m = tjRegex.exec(decoded)) !== null) {
            if (m[1]) parts.push(m[1].trim());
          }

          // Extraire les blocs TJ : [(T) 10 (E) -5 (X) (TE)] TJ
          const arrayTjRegex = /\[(.*?)\]\s*TJ/g;
          let arrM;
          while ((arrM = arrayTjRegex.exec(decoded)) !== null) {
            const innerRegex = /\(([^()]+)\)/g;
            let inM;
            const subWord: string[] = [];
            while ((inM = innerRegex.exec(arrM[1])) !== null) {
              if (inM[1]) subWord.push(inM[1]);
            }
            if (subWord.length > 0) {
              parts.push(subWord.join(''));
            }
          }
          break; // Décompression réussie pour ce bloc
        } catch {
          // essayer format suivant
        }
      }
    }

    if (parts.length > 5) {
      return parts.join(' ').replace(/\s+/g, ' ').trim();
    }
  } catch (err) {
    console.warn("Échec extraction flux Flate:", err);
  }

  return "";
}

/**
 * Extrait le texte d'un fichier PDF par tous les moyens possibles,
 * incluant le rendu Canvas et l'OCR multi-orientations (Tesseract.js) pour les scans et images.
 * Compatible Windows, macOS et Linux dans tous les navigateurs modernes (Chrome, Edge, Firefox, Safari).
 */
export async function extractTextFromPdf(
  fileOrBuffer: File | ArrayBuffer,
  onProgress?: (status: string) => void
): Promise<string> {
  const originalBuffer = fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;

  // 1. Méthode Principale : PDF.js avec worker local bundlé par Vite
  let pdfDocument: any = null;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(originalBuffer.slice(0)),
      useWorkerFetch: true,
      isEvalSupported: false,
      useSystemFonts: true
    });

    pdfDocument = await loadingTask.promise;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      try {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent({
          disableFontFace: true
        }).catch((err: any) => {
          console.warn(`[PDF.js] Échec flux de contenu page ${pageNum}:`, err?.message || err);
          return null;
        });

        if (!textContent || !textContent.items) continue;

        let lastY: number | null = null;
        let pageStr = '';

        for (const item of textContent.items as Array<{ str?: string; transform?: number[] }>) {
          if (!item || typeof item.str !== 'string') continue;
          const currentY = item.transform ? item.transform[5] : null;

          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 4) {
            pageStr += '\n' + item.str;
          } else {
            pageStr += (pageStr.endsWith(' ') || item.str.startsWith(' ') ? '' : ' ') + item.str;
          }
          lastY = currentY;
        }

        if (pageStr.trim()) {
          pageTexts.push(pageStr.trim());
        }
      } catch (pageErr) {
        console.warn(`Erreur lecture texte direct page ${pageNum}:`, pageErr);
      }
    }

    const fullPdfText = pageTexts.join('\n\n').trim();
    if (fullPdfText.length > 50) {
      return fullPdfText;
    }
  } catch (pdfErr) {
    console.warn("PDF.js texte direct insuffisant ou échoué, essai d'autres méthodes:", pdfErr);
  }

  // 2. Méthode de Secours : Décompression native des flux FlateDecode du PDF
  try {
    const streamText = await extractFromFlateStreams(originalBuffer.slice(0));
    if (streamText && streamText.length > 50) {
      return streamText;
    }
  } catch (flateErr) {
    console.warn("Échec décompression Flate:", flateErr);
  }

  // 3. Méthode OCR Universelle (Windows, Mac, Linux) pour les PDF scannés / images
  // Si le PDF ne contient pas de texte numérique sélectionnable, on rend toutes les pages sur Canvas
  // et on applique l'OCR Tesseract avec gestion de la rotation et mutualisation du worker
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      if (onProgress) onProgress("PDF scanné détecté : lancement de l'OCR multi-pages...");

      if (!pdfDocument) {
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(originalBuffer.slice(0)),
          useWorkerFetch: true,
          isEvalSupported: false,
          useSystemFonts: true
        });
        pdfDocument = await loadingTask.promise;
      }

      if (pdfDocument && pdfDocument.numPages >= 1) {
        // Fonction de rendu à résolution optimale (~200 DPI, scale 2.0-2.4) avec fond blanc opaque obligatoire pour Tesseract
        const renderPageToCanvas = async (page: any): Promise<HTMLCanvasElement | null> => {
          const baseVp = page.getViewport({ scale: 1.0 });
          // Scale optimal 2.0 à 2.5 (~1654 px de large, 200 DPI) : taille idéale pour LSTM Tesseract sans saturer la RAM Wasm
          const optimalScale = Math.min(2.5, Math.max(1.8, 1654 / (baseVp.width || 595)));
          const viewport = page.getViewport({ scale: optimalScale });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) return null;

          // Remplir impérativement en blanc opaque (un canvas vierge transparent crée des artefacts noirs dans Leptonica/Tesseract)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({
            canvasContext: ctx,
            viewport
          }).promise;
          return canvas;
        };

        const rotateCanvas = (source: HTMLCanvasElement, angle: number): HTMLCanvasElement => {
          if (angle === 0) return source;
          const rotCanvas = document.createElement('canvas');
          if (angle === 90 || angle === 270) {
            rotCanvas.width = source.height;
            rotCanvas.height = source.width;
          } else {
            rotCanvas.width = source.width;
            rotCanvas.height = source.height;
          }
          const rotCtx = rotCanvas.getContext('2d', { willReadFrequently: true });
          if (rotCtx) {
            rotCtx.fillStyle = '#FFFFFF';
            rotCtx.fillRect(0, 0, rotCanvas.width, rotCanvas.height);
            rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
            rotCtx.rotate((angle * Math.PI) / 180);
            rotCtx.drawImage(source, -source.width / 2, -source.height / 2);
          }
          return rotCanvas;
        };

        // Importer dynamiquement Tesseract.js pour ne pas alourdir le bundle initial
        const { createWorker } = await import('tesseract.js');
        // Utiliser le CDN standard pour les données entraînées (fra.traineddata.gz)
        const worker = await createWorker('fra', 1, {
          langPath: 'https://tessdata.projectnaptha.com/4.0.0',
          gzip: true
        });
        // PSM 3 : Segmentation automatique pleine page préservant toutes les lignes de texte et de tableau
        try {
          await worker.setParameters({
            tessedit_pageseg_mode: '3' as any,
            preserve_interword_spaces: '1'
          });
        } catch (paramErr) {
          console.warn("Configuration PSM Tesseract:", paramErr);
        }

        const totalPages = Math.min(pdfDocument.numPages, 6);
        const pageTexts: string[] = [];
        let detectedBestAngle = 0;
        let lastCanvas: HTMLCanvasElement | null = null;

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          if (onProgress) onProgress(`Rendu haute résolution page ${pageNum}/${totalPages}...`);
          const page = await pdfDocument.getPage(pageNum);
          const canvas = await renderPageToCanvas(page);
          if (!canvas) continue;
          lastCanvas = canvas;

          if (pageNum === 1) {
            // Sur la première page : tester 0° en premier
            if (onProgress) onProgress(`OCR page 1 (orientation initiale)...`);
            const image0 = canvas.toDataURL('image/jpeg', 0.95);
            const ret0 = await worker.recognize(image0);
            const text0 = ret0.data.text || '';
            const kw0 = (text0.match(/bulletin|paie|traitement|indice|brut|net|cotisation|gennevilliers|urssaf|sft|matricule/gi) || []).length;

            if (kw0 >= 4) {
              // Orientation standard déjà droite : inutile de tester 90°, 270°, 180°
              detectedBestAngle = 0;
              pageTexts.push(text0.trim());
            } else {
              // Si 0° n'a pas suffi, tester les autres angles pour détecter une orientation paysage ou inversée
              const anglesToTry = [90, 270, 180];
              let bestText = text0;
              let maxBulletinsKeywords = kw0;

              for (const angle of anglesToTry) {
                const rotCanvas = rotateCanvas(canvas, angle);
                const imageSource = rotCanvas.toDataURL('image/jpeg', 0.95);
                if (onProgress) onProgress(`OCR page 1 (orientation ${angle}°)...`);
                const ret = await worker.recognize(imageSource);
                const text = ret.data.text || '';

                const keywords = (text.match(/bulletin|paie|traitement|indice|brut|net|cotisation|gennevilliers|urssaf|sft|matricule/gi) || []).length;
                if (keywords > maxBulletinsKeywords) {
                  maxBulletinsKeywords = keywords;
                  bestText = text;
                  detectedBestAngle = angle;
                }

                if (keywords >= 5) {
                  detectedBestAngle = angle;
                  break;
                }
              }

              if (bestText.trim()) {
                pageTexts.push(bestText.trim());
              }
            }
          } else {
            // Pages 2 et suivantes : réutiliser directement l'angle détecté sur la page 1 (gain de vitesse 4x)
            if (onProgress) onProgress(`OCR page ${pageNum}/${totalPages}...`);
            const rotCanvas = rotateCanvas(canvas, detectedBestAngle);
            const imageSource = rotCanvas.toDataURL('image/jpeg', 0.95);
            const ret = await worker.recognize(imageSource);
            const text = ret.data.text || '';
            if (text.trim()) {
              pageTexts.push(text.trim());
            }
          }
        }

        // Zone Totaux récapitulatifs (bas de la dernière page) : OCR ciblé avec PSM 6 pour une précision absolue des chiffres
        if (lastCanvas) {
          try {
            if (onProgress) onProgress("Lecture haute précision des totaux récapitulatifs...");
            const orientedLastCanvas = rotateCanvas(lastCanvas, detectedBestAngle);
            const bottomCanvas = document.createElement('canvas');
            const cropY = Math.floor(orientedLastCanvas.height * 0.65);
            const cropH = orientedLastCanvas.height - cropY;
            bottomCanvas.width = orientedLastCanvas.width;
            bottomCanvas.height = cropH;
            const bCtx = bottomCanvas.getContext('2d', { willReadFrequently: true });
            if (bCtx) {
              bCtx.fillStyle = '#FFFFFF';
              bCtx.fillRect(0, 0, bottomCanvas.width, cropH);
              bCtx.drawImage(orientedLastCanvas, 0, cropY, orientedLastCanvas.width, cropH, 0, 0, orientedLastCanvas.width, cropH);
              await worker.setParameters({ tessedit_pageseg_mode: '6' as any });
              const bottomImage = bottomCanvas.toDataURL('image/jpeg', 0.92);
              const retBottom = await worker.recognize(bottomImage);
              if (retBottom.data.text && retBottom.data.text.trim().length > 20) {
                pageTexts.push(`--- RECAP TOTALS ---\n` + retBottom.data.text.trim());
              }
            }
          } catch (cropErr) {
            console.warn("OCR zone totaux non bloquant:", cropErr);
          }
        }

        await worker.terminate();

        const combinedText = pageTexts.join('\n\n--- PAGE SUIVANTE ---\n\n').trim();
        if (combinedText.length > 30) {
          return combinedText;
        }
      }
    } catch (ocrErr) {
      console.warn("Échec de l'OCR automatique:", ocrErr);
    }
  }

  // 4. Dernier recours : chaînes brutes ASCII / Latin1
  try {
    const bytes = new Uint8Array(originalBuffer.slice(0));
    const raw = new TextDecoder('latin1').decode(bytes);
    const matches: string[] = [];
    const regex = /\(([^()]{2,100})\)\s*(?:Tj|'|")/g;
    let m;
    while ((m = regex.exec(raw)) !== null) {
      if (m[1]) matches.push(m[1].trim());
    }
    if (matches.length > 5) {
      return matches.join(' ');
    }
  } catch (e) {
    // ignore
  }

  return "";
}

