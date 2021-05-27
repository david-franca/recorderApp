const { app, BrowserWindow, ipcMain, Menu, shell } = require("electron");
const path = require("path");
const os = require("os");
const fs = require("fs");

let destination = path.join(os.homedir(), "Audios");

const isDev = process.env.NODE_ENV === "development" ? true : false;

const isMac = process.platform === "darwin" ? true : false;

function createPreferenceWindow() {
  const preferenceWindow = new BrowserWindow({
    width: isDev ? 950 : 500,
    height: 150,
    backgroundColor: "#234",
    resizable: isDev ? true : false,
    show: false,
    icon: path.join(__dirname, "src", "assets", "icons", "icon.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  preferenceWindow.loadFile(
    path.join(__dirname, "./src/pages/preferences/index.html")
  );

  if (isDev) {
    preferenceWindow.webContents.openDevTools();
  }

  preferenceWindow.once("ready-to-show", () => {
    preferenceWindow.show();
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: isDev ? 950 : 500,
    height: 300,
    backgroundColor: "#234",
    resizable: isDev ? true : false,
    show: false,
    icon: path.join(__dirname, "src", "assets", "icons", "icon.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(
    path.join(__dirname, "src", "pages", "mainWindow", "index.html")
  );

  if (isDev) {
    win.webContents.openDevTools();
  }

  win.once("ready-to-show", () => {
    win.show();

    const menuTemplate = [
      {
        label: app.name,
        submenu: [
          {
            label: "Preferências",
            click: () => createPreferenceWindow(),
          },
          {
            label: "Abrir pasta de destino",
            click: () => shell.openPath(destination),
          },
        ],
      },
      {
        label: "Arquivo",
        submenu: [isMac ? { role: "close" } : { role: "quit" }],
      },
    ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("openNewWindow", () => {
  createWindow();
});

ipcMain.on("save_buffer", (e, buffer) => {
  const filePath = path.join(destination, `${Date.now()}`);
  fs.writeFileSync(`${filePath}.webm`, buffer);
});
