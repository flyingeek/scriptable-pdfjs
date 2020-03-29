
# ofp2text4scriptable

A PDF text parser for Scriptable App (ios).

This parser was made to parse some specific PDF files (OFP) but it can be used
on any PDF if you find that the PDFKit conversion offered by Shortcuts is
causing your text to be mixed up.

## Building

First install dependencies:

```sh
npm install
```

To create a production build:

```sh
npm run build
```

## Publishing

Copy dist/ofp2text4scriptable.html into Scriptable Document Folder.

## Running from Shortcuts app

- Pass a PDF using the sharesheet or an Open File action
- Add a Scriptable/Create bookmark action named ShortcutOFP for this file
- Add a Scriptable/Run Inline action containing :

```
const fm = FileManager.iCloud();
// scriptable needs the Create File Bookmark action to access the file
// use the same bookmark name below
const filePath = fm.bookmarkedPath("ShortcutOFP");
await fm. downloadFileFromiCloud(filePath);

// We are executing the pdfjs text conversion in a WebView
const wv = new WebView();
const htmlFileUrl = fm.joinPath(fm.documentsDirectory(), "ofp2text4scriptable.html");
await wv.loadFile(htmlFileUrl);

const javascript = 'ofp2text.getOFPText("' + fm.read(filePath).toBase64String() + '");';

// result is empty if an error occured
result = await wv.evaluateJavaScript(javascript, true);
Script.setShortcutOutput(result);
```

to dump a generic PDF to text, simply call ofp2text.getPDFtext()
instead of ofp2text.getOFPtext()

For some reasons... (bug in shortcuts ?) You cannot convert the PDF to Base64
within the shortcuts app and pass it to Scriptable. You have to use the bookmark
trick and make the conversion in Scriptable.
