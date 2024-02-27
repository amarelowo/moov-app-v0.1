const { exec } = require('child_process');

// Em serverManager.js
const find = require('find-process');

function killServerOnPort(port) {
    return new Promise((resolve, reject) => {
        find('port', port)
            .then(list => {
                if (!list.length) {
                    console.log(`Nenhum processo encontrado na porta ${port}`);
                    resolve();
                } else {
                    let count = list.length; // Contador para processos
                    list.forEach(process => {
                        console.log(`Matando o processo ${process.pid} na porta ${port}`);
                        exec(`taskkill /F /PID ${process.pid}`, (err) => {
                            if (err) {
                                console.error(`Erro ao matar o processo ${process.pid}: ${err}`);
                                reject(err);
                            } else {
                                console.log(`Processo ${process.pid} foi finalizado com sucesso`);
                                count--;
                                if (count === 0) resolve(); // Resolve quando todos processos forem finalizados
                            }
                        });
                    });
                }
            })
            .catch(err => {
                console.log(`Erro ao encontrar processo na porta ${port}: ${err}`);
                reject(err);
            });
    });
}


module.exports = { killServerOnPort }