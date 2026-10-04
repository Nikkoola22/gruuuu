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
 * Extrait le texte d'un fichier PDF par tous les moyens possibles
 */
export async function extractTextFromPdf(fileOrBuffer: File | ArrayBuffer): Promise<string> {
  const arrayBuffer = fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;

  // 1. Méthode Principale : PDF.js avec worker local bundlé par Vite
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: true,
      isEvalSupported: false,
      useSystemFonts: true
    });

    const pdf = await loadingTask.promise;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
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
    if (fullPdfText.length > 20) {
      return fullPdfText;
    }
  } catch (pdfErr) {
    console.warn("PDF.js principal a échoué, passage au décompresseur de flux natif:", pdfErr);
  }

  // 2. Méthode de Secours : Décompression native des flux FlateDecode du PDF
  const streamText = await extractFromFlateStreams(arrayBuffer);
  if (streamText && streamText.length > 20) {
    return streamText;
  }

  // 3. Dernier recours : chaînes brutes ASCII / Latin1
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
