const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline');



function createWindow () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadURL("http://localhost:3000")
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('message', (event, message) => {
  sendEndReceiveData(message)
    .then(resposta => {
      console.log(resposta)
    })
    .catch(erro => {
      console.error('Erro:', erro);
    });
});

async function sendEndReceiveData(dado) {
  const port = new SerialPort({ path: 'COM3', baudRate: 115200 }); // Ajuste o path conforme necessário
  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  return new Promise((resolve, reject) => {
    port.on('open', () => {
      console.log('Porta serial aberta');
      port.write(dado, (err) => {
        if (err) {
          reject('Erro ao enviar dados: ' + err.message);
          port.close();
        }
      });
    });

    parser.on('data', line => {
      sendToRenderer(line)
      console.log('Dados recebidos:', line);
      if (line === 'end') {

        

        resolve('Recebido sinal de encerramento');
        port.close();
      }
    });

    port.on('error', (err) => {
      reject('Erro na porta serial: ' + err.message);
      port.close();
    });

    port.on('close', () => {
      console.log('Porta serial fechada');
    });
  });
}



// Função que envia dados do main para o renderer

function sendToRenderer(data) {
  const windows = BrowserWindow.getAllWindows();

  if(windows.length > 0) {
    windows[0].webContents.send('fromMain', data);
  }
}