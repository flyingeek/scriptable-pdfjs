/*eslint-env browser */
/* globals completion */

const pdfjs = require('pdfjs-dist/build/pdf.js');
const PdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');
export const pdfjsLib = pdfjs;

if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjs.GlobalWorkerOptions.workerPort = new PdfjsWorker();
}

/**
 * returns the text of a page
 * @param pdf:pdfjs.Document
 * @param pageNo:number
 * @param separator:string=""
 * @returns {Promise<string>}
 */
async function getPageText(pdf, pageNo, separator="") {
  // noinspection JSUnresolvedFunction
  const page = await pdf.getPage(pageNo);
  const tokenizedText = await page.getTextContent();
  return tokenizedText.items.map(token => token.str).join(separator);
}

/**
 * Returns the text of all pdf pages matching the test function
 *
 * If you know that only a set of contiguous pages will match,
 * let say for example pages 2-3-4 will match the testFn, there is no need
 * to continue parsing until the EOF.
 * If you set the breakAfter parameter to true:
 * The function will then parse pages 1 to 4, fails to match on page 5
 * and will returns the text content of page 2-3-4
 *
 * With breakAfter set to false, the function would have parsed all pages
 * and would have produced on the same file the same results (the text content
 * of page 2-3-4) but using more processing time.
 *
 * The matchFn function receives (pageText, pageNo, pdfjs.Document) and should
 * returns true or false
 *
 * @param source: pdfjs.Document - the pdf document
 * @param matchFn:[function] - the match function
 * @param breakAfter:[boolean=false] - if true, stop the search after failure
 * @param pageSeparator:string="" - the page separator
 * @param tokenSeparator:string="" - the token separator
 * @returns {Promise<string>}
 */
export async function extractText(source, matchFn, breakAfter=false, pageSeparator="", tokenSeparator=""){
  const pdfPages = [];
  let matchingPagesCount = 0;
  const pdf = await pdfjs.getDocument(source).promise;
  const maxPages = pdf.numPages;
  for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
    const pageText = await getPageText(pdf, pageNo, tokenSeparator);
    if (matchFn) {
      if (matchFn(pageText, pageNo, pdf)) {
        pdfPages.push(pageText);
        matchingPagesCount += 1;
      } else if (breakAfter && matchingPagesCount !== 0) {
        break;
      }
    } else {
      pdfPages.push(pageText);
    }
  }
  return pdfPages.join(pageSeparator);
}

/**
 * a convenience wrapper to extractText using Scriptable completion fn
 * @param source:[string|object] - pdf source accepted by pdfjs.getDocument
 * @param matchFn:[function] - optional text matching function
 * @param breakAfter:[boolean=false]
 * @param pageSeparator:string="" - the page separator
 * @param tokenSeparator:string="" - the token separator
 */
export function getText(source, matchFn, breakAfter=false, pageSeparator="", tokenSeparator = "" ) {
  extractText(source, matchFn, breakAfter, pageSeparator, tokenSeparator)
    .then((text) => {
      completion(text)
  }, (error) => {
      throw Error(error);
  });
}
/**
 * a wrapper for getText when you need to use base64 string as source
 * @param base64string:string - the pdf in base64 string format
 * @param matchFn:[function] - optional text matching function
 * @param breakAfter:[boolean=false]
 * @param pageSeparator:string="" - the page separator
 * @param tokenSeparator:string="" - the token separator
 */
export function getTextFromBase64String(base64string, matchFn, breakAfter=false,  pageSeparator="", tokenSeparator = "") {
  getText({data: atob(base64string)}, matchFn, breakAfter, pageSeparator, tokenSeparator);
}

