const vscode = require('vscode');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Function to capture code snippet and convert to image
async function captureCodeToImage() {
  try {
    // Get active text editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active text editor found.');
      return;
    }

    // Get selected code
    const selection = editor.selection;
    const codeSnippet = editor.document.getText(selection);

    // Get language of code snippet
    const language = editor.document.languageId;

    // Create a new browser instance
    const browser = await puppeteer.launch(
      {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      }
    );
    const page = await browser.newPage();

    // Set Prism.js CSS for code styling and syntax highlighting
    await page.addStyleTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-tomorrow.min.css' });
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js' });
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-autoloader.min.js' }); // For automatic language detection

    // Inject code snippet into page
    await page.setContent(`<pre><code class="language-${language}">${codeSnippet}</code></pre>`);

    // Get dimensions of code snippet
    const dimensions = await page.evaluate(() => {
      const code = document.querySelector('pre code');
      const rect = code.getBoundingClientRect();
      return { width: Math.round(rect.width), height: Math.round(rect.height) };
    });

    // Set image dimensions
    // ... rest of your code
  } catch (error) {
    console.error(error);
  }
}