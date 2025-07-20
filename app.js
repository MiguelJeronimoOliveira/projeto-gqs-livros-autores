const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// Importar rotas
const autorRoutes = require('./src/routes/autorRoutes');
const livroRoutes = require('./src/routes/livroRoutes');

// Usar rotas
app.use('/api/autores', autorRoutes);
app.use('/api/livros', livroRoutes);

// Rotas das views
app.use('/autores', autorRoutes);
app.use('/livros', livroRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.render('index');
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;

