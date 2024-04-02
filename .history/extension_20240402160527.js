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
await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-javascript.min.js' }); // For JavaScript highlighting

// Inject code snippet into page
await page.setContent(`<pre><code class="language-javascript">${codeSnippet}</code></pre>`);

// Get dimensions of code snippet
const dimensions = await page.evaluate(() => {
	const code = document.querySelector('pre code');
	const rect = code.getBoundingClientRect();
	return { width: Math.round(rect.width), height: Math.round(rect.height) };
  });
  
  // Set image dimensions
  const width = Math.min(dimensions.width, 2560);
  const height = dimensions.height;
  
  // Set viewport size
  await page.setViewport({ width, height });

    // Take screenshot of the code snippet
    const screenshot = await page.screenshot({ fullPage: true });

    // Close the browser
    await browser.close();

	// Save the screenshot to Downloads directory with timestamp as filename
const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
const filename = `codesnapshot_${timestamp}.png`;
const downloadsDir = path.join(os.homedir(), 'Downloads');
fs.mkdirSync(downloadsDir, { recursive: true }); // Create the directory if it does not exist
const savePath = path.join(downloadsDir, filename);
fs.writeFileSync(savePath, screenshot);

    // Show success message with save path
    vscode.window.showInformationMessage(`Code snapshot saved at: ${savePath}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
}

// Activated when the extension is activated
function activate(context) {
  // Register command to convert code to image
  let disposable = vscode.commands.registerCommand('codesnapshot.c2i', () => {
    captureCodeToImage();
  });

  context.subscriptions.push(disposable);
}

// Deactivated when the extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};