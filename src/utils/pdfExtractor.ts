/**
 * Extracteur universel de texte pour fichiers PDF dans le navigateur
 * Utilise pdfjs-dist avec chargement paresseux (lazy-loaded) et worker local
 */

export async function extractTextFromPdf(fileOrBuffer: File | ArrayBuffer): Promise<string> {
  try {
    const arrayBuffer = fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;

    // Import dynamique pour préserver la taille du bundle initial
    const pdfjsLib = await import('pdfjs-dist');

    // Configuration du worker : local d'abord, puis CDN en secours
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      try {
        const baseUrl = import.meta.env.BASE_URL || '/';
        const localWorker = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}pdf.worker.min.js`;
        pdfjsLib.GlobalWorkerOptions.workerSrc = localWorker;
      } catch {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      }
    }

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

      // Regrouper les tokens texte en tenant compte des retours à la ligne
      let lastY: number | null = null;
      let pageStr = '';

      for (const item of textContent.items as Array<{ str?: string; transform?: number[] }>) {
        if (!item || typeof item.str !== 'string') continue;
        const currentY = item.transform ? item.transform[5] : null;

        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
          pageStr += '\n' + item.str;
        } else {
          pageStr += (pageStr.endsWith(' ') || item.str.startsWith(' ') ? '' : ' ') + item.str;
        }
        lastY = currentY;
      }

      pageTexts.push(pageStr.trim());
    }

    const fullText = pageTexts.join('\n\n').trim();
    if (fullText.length > 10) {
      return fullText;
    }
  } catch (pdfErr) {
    console.warn("Échec de l'extraction PDF via PDF.js, tentative de fallback binaire:", pdfErr);
  }

  // Fallback de secours : tentative de lecture de chaînes brutes dans le binaire PDF
  try {
    const arrayBuffer = fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;
    const bytes = new Uint8Array(arrayBuffer);
    const raw = new TextDecoder('latin1').decode(bytes);

    // Recherche de blocs de texte parenthésés (Tj / TJ)
    const matches: string[] = [];
    const regex = /\(([^()]{2,100})\)\s*(?:Tj|'|")/g;
    let m;
    while ((m = regex.exec(raw)) !== null) {
      if (m[1]) matches.push(m[1]);
    }

    if (matches.length > 5) {
      return matches.join(' ');
    }
  } catch (rawErr) {
    console.warn("Fallback binaire échoué:", rawErr);
  }

  return "";
}
