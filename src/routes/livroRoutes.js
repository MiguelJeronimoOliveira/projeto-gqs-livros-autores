const express = require('express');
const router = express.Router();
const LivroController = require('../controllers/livroController');

// Rotas da API
router.get('/', LivroController.index);
router.get('/:id', LivroController.show);
router.post('/', LivroController.create);
router.put('/:id', LivroController.update);
router.delete('/:id', LivroController.delete);

// Rotas das views
router.get('/novo', LivroController.newForm);
router.get('/:id/editar', LivroController.editForm);

module.exports = router;

