const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backend;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile(path.join(__dirname, 'public', 'index.html'));
}

app.whenReady().then(() => {
  backend = spawn('node', ['index.js'], {
    cwd: __dirname,
    shell: true
  });

  backend.stdout.on('data', (data) => {
    console.log(`[BACKEND]: ${data}`);
  });

  backend.stderr.on('data', (data) => {
    console.error(`[BACKEND ERROR]: ${data}`);
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  if (backend) backend.kill();
});
