const fs = require('fs');
const mkdirp = require('mkdirp');

const STORAGE_DIRECTORY = './storage';
const STORAGE_FILE = './storage/data.json';

// Carregar os dados do arquivo
const loadStorage = () => {
  try {
    const data = fs.readFileSync(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {
      queue: [],
      currentNumber: 0,
      totalIssuedToday: 0,
      callHistory: []
    };
  }
};

// Salvar os dados no arquivo
const saveStorage = (data) => {
  mkdirp.sync(STORAGE_DIRECTORY); // Criar diretório se não existir
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(data), 'utf8');
};

module.exports = { loadStorage, saveStorage };
