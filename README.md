
# scriptable-pdfjs

A PDF text parser for [Scriptable App](https://scriptable.app) (iOS).

iOS shortcuts PDF conversion is not always the good tool.
Due to the "intelligent" column recognition of PDFKit, text output
is sometime in total disorder. I needed a parser which always output text in a 
predictable order, and this tool does that using the pdfjs text extraction.

## Building

First install dependencies:

```sh
npm install
```

To create a build:

```sh
npm run build
```

## Running from Scriptable

Copy `dist/scriptable-pdfjs.html` into Scriptable Document Folder.

```javascript
const fm = FileManager.iCloud();
const wv = new WebView();
const htmlFileUrl = fm.joinPath(fm.documentsDirectory(), "scriptable-pdfjs.html");
await wv.loadFile(htmlFileUrl);

/*
 In the WebView your javascript will have access to the pdfjs global var.
 pdfjs.pdfjsLib is the pdfjs module
 pdfjs.getPDFText is a convenience wrapper
 You have to pass the pdf file as a base64 string
*/

let javascript = 'pdfjs.getPDFText(';
javascript += '"' + fm.read(pdfFilePath).toBase64String() + '"';
javascript += ');'

let result = "";
try {
  result = await wv.evaluateJavaScript(javascript, true);
} catch (e) {
  //...
}
//...
```

## Running from Shortcuts app

In this example we also expect to find scriptable-pdfjs.html` in Scriptable
documents folder

- Pass a PDF using the sharesheet or an Open File action
- Save a copy of that file in the Shortcut Folder to allow the next bookmark creation action
- Add a Scriptable/Create bookmark action
- Add a Scriptable/Run Inline action containing :

```javascript
let fm;
try {
  fm = FileManager.iCloud();
} catch(e) {
  fm = FileManager.local();
}
// use the same bookmark name as in the action above
const filePath = fm.bookmarkedPath("ShortcutPDF");
await fm. downloadFileFromiCloud(filePath); // works also for local file

// We execute pdfjs in a WebView
const wv = new WebView();
const htmlFileUrl = fm.joinPath(fm.documentsDirectory(), "scriptable-pdfjs.html");
await wv.loadFile(htmlFileUrl);

let javascript = 'pdfjs.getPDFText(';
javascript += '"' + fm.read(filePath).toBase64String() + '"';
javascript += ', (pageText) => pageText.includes("(Long copy #1)")';
javascript += ', true';
javascript += ');'


try {
  result = await wv.evaluateJavaScript(javascript, true);
} catch (e) {
  result = "";
}
Script.setShortcutOutput(result);
```
For some reasons... (bug in shortcuts or scriptable ?) You cannot convert
the PDF to Base64 and pass it as an argument to the script. You have to use
the bookmark trick and make the base64 conversion in Scriptable.
