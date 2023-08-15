const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;

const routes = require('./routes');

app.use(cors());
app.use(express.json());

dotenv.config();

const resetDailyCount = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const timeUntilTomorrow = tomorrow - now;

  setTimeout(() => {
    totalIssuedToday = 0;
    resetDailyCount();
  }, timeUntilTomorrow);
};

resetDailyCount();

app.use(routes);

// Encerrar servidor e salvar dados no arquivo ao encerrar
process.on('SIGINT', () => {
  saveStorage();
  process.exit();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
