import { app, BrowserWindow } from 'electron';
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url';
import { autoUpdater } from 'electron-updater'; 
import path from 'node:path';
// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: any;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    startUpdate()
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
  
}

function startUpdate () {
  autoUpdater.on('checking-for-update', () => {
    win.webContents.send('checking-for-update');
  });
  autoUpdater.on('update-not-available', () => {
    win.webContents.send('update-not-available');
  });
  autoUpdater.on('download-progress', (progressTrack) => {
    win.webContents.send('update-progress', progressTrack.percent);
  });
  
  autoUpdater.on('update-available', (info) => {
    win.webContents.send('update-available', info);
  });
  autoUpdater.on('error', (error) => {
    win.webContents.send('error', error);
  });
  
  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall(true, true);
  })
}



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});
