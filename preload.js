const { contextBridge, ipcRenderer } = require("electron")

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
  })


  contextBridge.exposeInMainWorld('electron', {
    sendData: (data) => ipcRenderer.send('message',  data),
    receive: (channel, func) => {
      const validChannels = ['fromMain']; // Adicione outros canais conforme necessário
      if (validChannels.includes(channel)) {
          ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    updateStorage: (updatedProducts) => ipcRenderer.send('update-storage', updatedProducts)
  });

  