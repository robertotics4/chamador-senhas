const express = require('express');
const router = express.Router();
const { loadStorage, saveStorage } = require('./storageUtils');

router.post('/enqueue', (req, res) => {
  const storageData = loadStorage();

  if (storageData.totalIssuedToday >= process.env.MAX_DAILY_LIMIT) {
    return res.status(400).json({ message: 'Limite diário de senhas atingido.' });
  }

  storageData.totalIssuedToday++;
  storageData.queue.push(storageData.currentNumber + 1);
  storageData.currentNumber++;

  saveStorage(storageData);

  return res.status(201).json({ message: `Senha ${storageData.currentNumber} adicionada à fila.` });
});

router.get('/call', (req, res) => {
  const storageData = loadStorage();

  if (storageData.queue.length > 0) {
    const calledNumber = storageData.queue.shift();
    storageData.callHistory.unshift(calledNumber);

    if (storageData.callHistory.length > process.env.MAX_HISTORY_SIZE) {
      storageData.callHistory.pop();
    }

    storageData.currentNumber = calledNumber;
    saveStorage(storageData);

    return res.status(200).json({ message: `Chamando senha ${storageData.currentNumber}.` });
  } else {
    return res.status(404).json({ message: 'Não há senhas na fila.' });
  }
});

router.get('/recall', (req, res) => {
  const storageData = loadStorage();

  if (storageData.callHistory.length > 0) {
    const recalledNumber = storageData.callHistory[0]; // Pega a última senha chamada no histórico
    res.status(200).json({ message: `Rechamando a senha ${recalledNumber}.` });
  } else {
    res.status(404).json({ message: 'Não há senhas no histórico de chamadas.' });
  }
});

router.get('/status', (req, res) => {
  const storageData = loadStorage();

  const status = {
    currentNumber: storageData.currentNumber,
    lastCalled: storageData.callHistory.slice(0, process.env.MAX_HISTORY_SIZE)
  };

  return res.status(200).json(status);
});

module.exports = router;
