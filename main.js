const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const os = require("os");

const isDev = process.env.NODE_ENV === "development" ? true : false;

const isMac = process.platform === "darwin" ? true : false;

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
            click: () => {},
          },
          {
            label: "Abrir pasta de destino",
            click: () => {},
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
