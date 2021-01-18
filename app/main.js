const {app, BrowserWindow, dialog} = require('electron')
const fs = require('fs')
let ipcMain = require('electron').ipcMain;

const getFileFromUser = exports.getFileFromUser = (num) => {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name:'任意文件',extensions:['*']}
        ]
    }).then(result => {
        console.log(result)
        const file = result.filePaths[0]
        const content = fs.readFileSync(file).toString();
        mainWindow.webContents.send('file-opened',file,content,num);
        console.log(content)
    }).catch(err => {
        console.log(err)
    })

}

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 480,
        maxHeight: 480,
        maxWidth: 800,        
        minHeight:480,
        minWidth:800,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule:true
        },
        frame:false
    })
    mainWindow.loadFile('app/index.html')
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.webContents.openDevTools();
    })
    mainWindow.on('close', () => {
        mainWindow = null;
    })
})

ipcMain.on('window-min', function() {
    mainWindow.minimize();
})
//接收最大化命令
ipcMain.on('window-max', function() {
    if (mainWindow.isMaximized()) {
        mainWindow.restore();
    } else {
        mainWindow.maximize();
    }
})
//接收关闭命令
ipcMain.on('window-close', function() {
    mainWindow.close();
})

ipcMain.on('saveFile', () => {
    dialog.showSaveDialog({
        title: '导出文件',
        filters: [
            {name: 'All', extension: ['*']}
        ]
    }).then((res) => {
        console.log(res)
        mainWindow.webContents.send('exportPath', res);
    })
})
