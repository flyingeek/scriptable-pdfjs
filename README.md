
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

Copy the file `dist/scriptable-pdfjs.html` into Scriptable Document Folder.

and use [scriptable-pdfjs-demo](https://gist.github.com/flyingeek/70f5e09887f17dbfcd11a4b620a68b28) to play.

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

// We execute pdfjs in a WebView
const wv = new WebView();
const htmlFileUrl = fm.joinPath(fm.documentsDirectory(), "scriptable-pdfjs.html");
await fm.downloadFileFromiCloud(htmlFileUrl);
await wv.loadFile(htmlFileUrl);

let javascript = 'pdfjs.getText(';
javascript += '"' + fm.read(filePath).toBase64String() + '"';
//javascript += ', (pageText) => pageText.includes("(Long copy #1)")';
//javascript += ', true';
javascript += ');'

let result = "";
try {
  result = await wv.evaluateJavaScript(javascript, true);
} catch (e) {
  result = "";
}
return result;
```
For some reasons... (bug in shortcuts or scriptable ?) You cannot convert
the PDF to Base64 and pass it as an argument to the script. You have to use
the bookmark trick and make the base64 conversion in Scriptable.

For file larger than 2.5 Mo, you can not run this script inline and you 
have to modify the script to get results by using the clipboard.
