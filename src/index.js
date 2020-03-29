/*eslint-env browser */
// eslint-disable-next-line no-unused-vars
/* globals log, logError, completion */

const pdfjs = require('pdfjs-dist/build/pdf.js');
const PdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjs.GlobalWorkerOptions.workerPort = new PdfjsWorker();
}

async function getPageText(pdf, pageNo) {
  // noinspection JSUnresolvedFunction
  const page = await pdf.getPage(pageNo);
  const tokenizedText = await page.getTextContent();
  return tokenizedText.items.map(token => token.str).join("");
}

async function extractPDFText(source, textTestFn, isOfp=false){
  const ofpPages = [];
  let processedPages = 0;
  const pdf = await pdfjs.getDocument(source).promise;
  const maxPages = pdf.numPages;
  for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
    //log(pageNo);
    const pageText = await getPageText(pdf, pageNo);
    if (textTestFn) {
      if (textTestFn(pageText)) {
        ofpPages.push(pageText);
        processedPages += 1;
      } else if (isOfp && processedPages !== 0) {
        break;
      }
    } else {
      ofpPages.push(pageText);
    }
  }
  return ofpPages.join("");
}

// noinspection JSUnusedGlobalSymbols
export function getOFPText(base64string) {
  extractPDFText(
    {data: atob(base64string)},
    (pageText) => pageText.includes("(Long copy #1)"),
    true).then((text) => {
      completion(text)
  }, (error) => {
      logError(error);
      completion("");
  });
}

// noinspection JSUnusedGlobalSymbols
export function getPDFText(base64string) {
  extractPDFText(
    {data: atob(base64string)}).then((text) => {
      completion(text)
  }, (error) => {
      logError(error);
      completion("");
  });
}

