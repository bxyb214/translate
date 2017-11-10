'use strict'

import { app, Menu, MenuItem, BrowserWindow } from 'electron'
import setReferer from 'electron-referer'
import path from 'path'
import MenubarWindow from './menubar'
import { checkForUpdates } from './autoUpdate'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let updateWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  // Initial window options
  mainWindow = new MenubarWindow({
    title: 'Google Translate',
    icon: path.join(__static, 'icon.ico'),
    index: winURL,
    height: 190,
    width: 420,
    hasShadow: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    scrollBounce: true,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  })

  // 修复生产环节下无法复制粘贴
  if (process.env.NODE_ENV !== 'development') {
    const menu = new Menu()
    menu.append(new MenuItem({ role: 'editMenu' }))
    Menu.setApplicationMenu(menu)
  }

  // npm v5.3.0 builded is blank

  mainWindow.on('after-create-window', () => {
    const window = mainWindow.window
    // window.webContents.openDevTools()
    window.setReferer = (ref) => setReferer(ref, window)
    window.setReferer('https://www.google.com')
    window.on('closed', () => (mainWindow = null))
  })
}

function createUpdateWindow () {
  const loadURL = winURL + '#/update'
  updateWindow = new BrowserWindow({
    title: 'Software Update',
    width: 620,
    height: 400,
    minHeight: 400,
    resizable: false,
    maximizable: false,
    show: false
  })

  updateWindow.on('closed', () => (updateWindow = null))
  checkForUpdates(updateWindow, loadURL)
}

app.on('ready', createWindow)
app.on('ready', createUpdateWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
