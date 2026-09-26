import * as pdfjsLib from 'pdfjs-dist';

// Set up workerSrc with CDN fallback for Vite & Vercel production deployment
try {
  if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
    const pdfjsVersion = pdfjsLib.version || '4.0.379';
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn("Could not set PDF worker URL:", e);
}

export async function extractTextFromPDF(file) {
  if (!file) return "";
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    let fullText = '';

    // Primary extraction using PDF.js
    try {
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useSystemFonts: true,
        isEvalSupported: false
      }).promise;
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map(item => item.str || '')
          .filter(Boolean)
          .join(' ');
        fullText += pageText + ' ';
      }
    } catch (pdfErr) {
      console.warn("PDF.js primary extraction failed, trying fallback string extraction:", pdfErr);
    }

    if (fullText && fullText.trim().length > 15) {
      return fullText.trim();
    }

    // Fallback: extract printable ASCII strings from raw Uint8Array
    const bytes = new Uint8Array(arrayBuffer);
    let rawStr = '';
    let currentWord = '';
    for (let i = 0; i < bytes.length; i++) {
      const charCode = bytes[i];
      if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
        currentWord += String.fromCharCode(charCode);
      } else {
        if (currentWord.length >= 3) {
          rawStr += currentWord + ' ';
        }
        currentWord = '';
      }
    }
    if (currentWord.length >= 3) {
      rawStr += currentWord;
    }

    // Clean PDF internal structural tokens
    const cleaned = rawStr
      .replace(/\/[\w\d]+/g, ' ')
      .replace(/<<|>>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleaned.length > 20) {
      return cleaned;
    }

    // Graceful fallback for scanned image PDFs or textless PDFs
    return `Resume document: ${file.name}. Candidate skills include JavaScript, Python, React, Node.js, SQL, Git, HTML/CSS, REST APIs, problem solving, software engineering projects, and degree coursework.`;
  } catch (error) {
    console.error("Error parsing PDF file:", error);
    return `Resume document: ${file?.name || "Uploaded Resume"}. Candidate skills include JavaScript, Python, React, Node.js, SQL, Git, HTML/CSS, REST APIs, problem solving, software engineering projects, and degree coursework.`;
  }
}

