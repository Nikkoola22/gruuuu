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
  const arrayBuffer = fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;

  // 1. Méthode Principale : PDF.js avec worker local bundlé par Vite
  let pdfDocument: any = null;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: true,
      isEvalSupported: false,
      useSystemFonts: true
    });

    pdfDocument = await loadingTask.promise;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();

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
    }

    const fullPdfText = pageTexts.join('\n\n').trim();
    if (fullPdfText.length > 50) {
      return fullPdfText;
    }
  } catch (pdfErr) {
    console.warn("PDF.js texte direct insuffisant ou échoué, essai d'autres méthodes:", pdfErr);
  }

  // 2. Méthode de Secours : Décompression native des flux FlateDecode du PDF
  const streamText = await extractFromFlateStreams(arrayBuffer);
  if (streamText && streamText.length > 50) {
    return streamText;
  }

  // 3. Méthode OCR Universelle (Windows, Mac, Linux) pour les PDF scannés / images
  // Si le PDF ne contient pas de texte numérique sélectionnable, on rend la première page sur Canvas
  // et on applique l'OCR Tesseract avec gestion de la rotation (portrait ou paysage)
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      if (onProgress) onProgress("PDF scanné détecté : lancement de l'OCR automatique...");

      if (!pdfDocument) {
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
          useWorkerFetch: true,
          isEvalSupported: false,
          useSystemFonts: true
        });
        pdfDocument = await loadingTask.promise;
      }

      if (pdfDocument && pdfDocument.numPages >= 1) {
        const page = await pdfDocument.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x pour une netteté OCR optimale

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;

          // Importer dynamiquement Tesseract.js pour ne pas alourdir le bundle initial
          const { createWorker } = await import('tesseract.js');
          const worker = await createWorker('fra');

          const anglesToTry = [0, 90, 270, 180];
          let bestText = '';
          let maxBulletinsKeywords = -1;

          for (const angle of anglesToTry) {
            let imageSource: HTMLCanvasElement = canvas;
            if (angle !== 0) {
              const rotCanvas = document.createElement('canvas');
              if (angle === 90 || angle === 270) {
                rotCanvas.width = canvas.height;
                rotCanvas.height = canvas.width;
              } else {
                rotCanvas.width = canvas.width;
                rotCanvas.height = canvas.height;
              }
              const rotCtx = rotCanvas.getContext('2d');
              if (rotCtx) {
                rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
                rotCtx.rotate((angle * Math.PI) / 180);
                rotCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
                imageSource = rotCanvas;
              }
            }

            if (onProgress) onProgress(`Reconnaissance optique (OCR angle ${angle}°)...`);
            const ret = await worker.recognize(imageSource);
            const text = ret.data.text || '';

            // Compter les mots-clés typiques d'un bulletin de paie français / Ciril
            const keywords = (text.match(/bulletin|paie|traitement|indice|brut|net|cotisation|gennevilliers|urssaf|sft|matricule/gi) || []).length;
            if (keywords > maxBulletinsKeywords) {
              maxBulletinsKeywords = keywords;
              bestText = text;
            }

            // Si on a déjà trouvé de nombreux mots-clés clés, l'orientation est certaine
            if (keywords >= 5) {
              break;
            }
          }

          await worker.terminate();

          if (bestText && bestText.trim().length > 30) {
            return bestText;
          }
        }
      }
    } catch (ocrErr) {
      console.warn("Échec de l'OCR automatique:", ocrErr);
    }
  }

  // 4. Dernier recours : chaînes brutes ASCII / Latin1
  try {
    const bytes = new Uint8Array(arrayBuffer);
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

