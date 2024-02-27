const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const fs = require('fs')
const storageFilePath = path.join(__dirname, 'storage.json')
const { exec } = require('child_process')

const { killServerOnPort } = require('./serverManager')


let nextServerProcess = null;
let isServerShuttingDown = false;



function createWindow () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.setMenuBarVisibility(false)

  const startURL = "http://localhost:3000"

  win.loadURL(startURL).catch(() => {
    console.log('Falha ao iniciar o URL, tentando novamente...')
    setTimeout(() => win.loadURL(startURL), 5000);
  })

  win.on('did-fail-load', () => {
    setTimeout(() => {
      win.loadURL(startURL);
    }, 5000);
  })
  
}


app.on('before-quit', (event) => {
  // Se o servidor já estiver em processo de finalização, apenas retorne
  if (isServerShuttingDown) {
    return;
  }

  // Marque que o servidor está sendo finalizado para evitar múltiplas chamadas
  isServerShuttingDown = true;

  // Impede o fechamento imediato até que o servidor seja finalizado
  event.preventDefault();

  killServerOnPort(3000) // Substitua 3000 pela porta do seu servidor
      .then(() => {
          console.log('Servidor finalizado com sucesso.');
          app.quit(); // Fecha o aplicativo após o servidor ser finalizado
      })
      .catch((err) => {
          console.error('Falha ao finalizar o servidor:', err);
          app.quit(); // Fecha o aplicativo mesmo se houver erro
      });
});

function startNextServer() {
  // Inicia o servidor Next.js e armazena a referência ao processo
  nextServerProcess = exec('npm run dev', (err, stdout, stderr) => {
    if (err) {
      console.error(`Erro ao iniciar o servidor Next.js: ${err}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

app.whenReady().then(() => {
  startNextServer()
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
  // console.log(readStorageFile())
  sendEndReceiveData(message)
    .then(resposta => {
      console.log(resposta)
    })
    .catch(erro => {
      console.error('Erro:', erro);
    });
});

ipcMain.on('activity-detected', () => {

  const win = BrowserWindow.getFocusedWindow()

  if(win) {
    win.loadURL('http://localhost:3000')
  }
})

ipcMain.on('inactivity-detected', () => {
  const win = BrowserWindow.getFocusedWindow()

  if(win) {
    win.loadURL('http://localhost:3000/video')
  }
})

ipcMain.on('update-storage', (event, updatedProducts) => {
  console.log('update-storage recebeu uma mensagem ', updatedProducts)
  updateStorage(updatedProducts);
})

ipcMain.on('request-stock', (event) => {
  
  const stockData = readStorageFile();

  // console.log('Lido o storage.json ', stockData)
  event.sender.send('stock-data',stockData)
})


async function sendEndReceiveData(dado) {
  const port = new SerialPort({ path: 'COM5', baudRate: 115200 }); // Ajuste o path conforme necessário
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

// Função que lê o arquivo storage.json

function readStorageFile() {
  if(!fs.existsSync(storageFilePath)) {
    fs.writeFileSync(storageFilePath, JSON.stringify({}))
  }

  return JSON.parse(fs.readFileSync(storageFilePath), 'utf8')
}

// Função para atualizar a quantidade de um produto 

function updateStorage(updatedStock) {
  const data = readStorageFile();

  Object.keys(updatedStock).forEach(id => {
    const product = updatedStock[id]
    if(data[id]) {
      data[id].quantity = product.quantity
    } else {
      console.error('Produto não encontrado no storage: ', product)
    }
  })

  fs.writeFileSync(storageFilePath, JSON.stringify(data, null, 2))
}