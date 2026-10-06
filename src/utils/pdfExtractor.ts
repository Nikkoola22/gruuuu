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

      // Grouper les éléments par ligne (Y) avec une tolérance pour gérer les légers décalages
      const lines: { y: number, items: Array<{ str: string, x: number }> }[] = [];
      for (const item of textContent.items as Array<{ str?: string; transform?: number[] }>) {
        if (!item || typeof item.str !== 'string' || item.str.trim() === '') continue;
        const x = item.transform ? item.transform[4] : 0;
        const y = item.transform ? item.transform[5] : 0;
        
        const existingLine = lines.find(l => Math.abs(l.y - y) <= 8);
        if (existingLine) {
          existingLine.items.push({ str: item.str, x });
        } else {
          lines.push({ y, items: [{ str: item.str, x }] });
        }
      }

      // Trier les lignes de haut en bas (le Y de PDF.js part du bas de la page, donc Y décroissant)
      lines.sort((a, b) => b.y - a.y);

      let pageStr = '';
      for (const line of lines) {
        // Trier les éléments de gauche à droite
        line.items.sort((a, b) => a.x - b.x);
        pageStr += line.items.map(i => i.str).join(' ') + '\n';
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
        // Importer dynamiquement Tesseract.js pour ne pas alourdir le bundle initial
        const { createWorker, PSM } = await import('tesseract.js');
        const worker = await createWorker('fra');
        await worker.setParameters({
          tessedit_pageseg_mode: PSM.SINGLE_BLOCK, // PSM 6: Force la lecture ligne par ligne
          preserve_interword_spaces: '1', // Indispensable pour conserver l'espacement des colonnes du tableau
        });

        let fullOcrText = '';
        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 }); // 2x pour une netteté OCR optimale

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport }).promise;

          if (onProgress) onProgress(`Reconnaissance optique (OCR page ${pageNum}/${pdfDocument.numPages})...`);
          const ret = await worker.recognize(canvas);
          fullOcrText += (ret.data.text || '') + '\n\n';
        }

        await worker.terminate();

        if (fullOcrText.trim().length > 30) {
          return fullOcrText;
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

