const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const {Menu} = require('electron')

// = "This can be accessed anywhere!";

global.servers = {
  localURL:'http://localhost:3000/',
  remoteURL:'http://acdc0.asiaa.sinica.edu.tw:47569/'
};
// global.remoteURL  = 'dummy';//'http://acdc0.asiaa.sinica.edu.tw:47569/';
// global.localURL = 'http://localhost:3000/';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let menuServerIndex = 3;
const defaultWidth = 1280;
const defaultHeight = 720;
let mainWindow
let localWindow
let remoteWindow
let contextMenu
const {ipcMain} = require('electron')

ipcMain.on('change-to-remote', (event, arg)=> {
  console.log("change to remote");

  contextMenu.items[menuServerIndex].submenu.items[0].checked = false
  contextMenu.items[menuServerIndex].submenu.items[1].checked = true

  naviToRemoteWindow();

})

ipcMain.on('changeRemoteURL', (event, arg)=> {
  console.log("changeRemoteURL:", arg);
  servers.remoteURL = arg;
  addMenus();
  // contextMenu.items[4].submenu.items[1].label=arg;
  // console.log(contextMenu.items[4].submenu.items);

})


ipcMain.on('change-to-local', (event, arg)=> {
  console.log("change to local");

  contextMenu.items[menuServerIndex].submenu.items[0].checked = true
  contextMenu.items[menuServerIndex].submenu.items[1].checked = false

  naviToLocalWindow();

})



// function changeToRemote() {
//
// }

// selector: seems to be deprecated
// role: https://github.com/electron/electron/blob/master/docs/api/menu-item.md#roles
function addMenus() {
  console.log("start adding menus !!!!");

  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        }, {
          role: 'redo'
        }, {
          type: 'separator'
        }, {
          role: 'cut'
        }, {
          role: 'copy'
        }, {
          role: 'paste'
        }, {
          role: 'pasteandmatchstyle'
        }, {
          role: 'delete'
        }, {
          role: 'selectall'
        }
      ]
    }, {
      label: 'View',
      submenu: [
        {
          role: 'reload'
        }, {
          role: 'forcereload'
        }, {
          role: 'toggledevtools'
        }, {
          type: 'separator'
        }, {
          role: 'resetzoom'
        }, {
          role: 'zoomin'
        }, {
          role: 'zoomout'
        }, {
          type: 'separator'
        }, {
          role: 'togglefullscreen'
        }
      ]
    }, {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        }, {
          role: 'close'
        }
      ]
    }, {
      label: 'Local/Remote',
      submenu: [
        // {
        //   label: 'Local',
        //   accelerator: 'Command+Z',
        //   selector: 'undo:'
        // }, {
        //   label: 'Redo',
        //   accelerator: 'Shift+Command+Z',
        //   selector: 'redo:'
        // }
        {
          label: 'Local:'+servers.localURL,
          // role: 'local',
          type: 'checkbox', checked: false,
          click: function(item, BrowserWindow) {
            // alert('Local mode!');
            // mainWindow.loadURL('https://github.com');
            //     appMenu.items[0].submenu.items[3].checked = item.checked;

           // console.log(contextMenu);
           // if (contextMenu.items[4].submenu.items[0] === item ) {
           //   console.log("click first item");
           // }

           if ( item.checked == true) {
             contextMenu.items[menuServerIndex].submenu.items[1].checked = false;//!contextMenu.items[4].submenu.items[1].checked
             // item.checked = false;//!item.checked;

             naviToLocalWindow();
             // mainWindow.loadURL(localURL);
              // mote.getCurrentWindow().loadURL('https://github.com')
            } else {
              item.checked = true;
            }

          }
        }, {
          label: 'Remote:'+servers.remoteURL,
          type: 'checkbox', checked: false,

          // role: 'remote',
          click: function(item, BrowserWindow) {
            // alert('Local mode!');
            // item.checked = !item.checked;
            // appMenu.items[0].submenu.items[3].checked = item.checked;

            // if (contextMenu.items[4].submenu.items[0] === item ) {
            //   console.log("click first item");
            // }


            if ( item.checked == true) {
              contextMenu.items[menuServerIndex].submenu.items[0].checked = false;//!contextMenu.items[4].submenu.items[0].checked;
              naviToRemoteWindow();
            } else {
              item.checked = true;
            }
          }
        }
        // {role: 'toggledevtools'},
        // {type: 'separator'},
        // {role: 'resetzoom'},
        // {role: 'zoomin'},
        // {role: 'zoomout'},
        // {type: 'separator'},
        // {role: 'togglefullscreen'}
      ]
    }, {
      // label: 'View2',
      role: 'help', // role is unique, role: 'help2' is not invalid
      submenu: [
        {
          label: 'Learn More !!',
          click() {
            require('electron').shell.openExternal('https://electron.atom.io')
          }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    menuServerIndex=4;
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          role: 'about'
        }, {
          type: 'separator'
        }, {
          role: 'services',
          submenu: []
        }, {
          type: 'separator'
        }, {
          role: 'hide'
        }, {
          role: 'hideothers'
        }, {
          role: 'unhide'
        }, {
          type: 'separator'
        }, {
          role: 'quit'
        }
      ]
    })

    // Edit menu
    template[1].submenu.push({
      type: 'separator'
    }, {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        }, {
          role: 'stopspeaking'
        }
      ]
    })

    // Window menu
    template[3].submenu = [
      {
        role: 'close'
      }, {
        role: 'minimize'
      }, {
        label: 'Maximize (zoom)',
        role: 'zoom'
      }, {
        type: 'separator'
      }, {
        role: 'front'
      }
    ]
  }

  contextMenu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(contextMenu)

}

function naviToLocalWindow() {
  if (!localWindow) {
    console.log("create local");
    localWindow = new BrowserWindow({width: defaultWidth, height: defaultHeight})
    localWindow.loadURL(servers.localURL);
  }

  localWindow.show();
  if (remoteWindow) {
    remoteWindow.hide();
  }

  mainWindow.hide();
}

function naviToRemoteWindow() {
  if (!remoteWindow) {
    console.log("create remote");
    remoteWindow = new BrowserWindow({width: defaultWidth, height: defaultHeight})
    remoteWindow.loadURL(servers.remoteURL);
  }

  remoteWindow.show();

  if(localWindow) {
    localWindow.hide();
  }
  mainWindow.hide();

}

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1280, height: 720})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // ** add menu items  **
  addMenus();
  // ** end **

  // mainWindow.loadURL('http://localhost:3000/');
  // mainWindow.loadURL('http://acdc0.asiaa.sinica.edu.tw:47569/');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    console.log("createMainWindow in activate")
    createMainWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
