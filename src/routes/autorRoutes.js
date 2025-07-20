const express = require('express');
const router = express.Router();
const AutorController = require('../controllers/autorController');

// Rotas da API
router.get('/', AutorController.index);
router.get('/:id', AutorController.show);
router.post('/', AutorController.create);
router.put('/:id', AutorController.update);
router.delete('/:id', AutorController.delete);

// Rotas das views
router.get('/novo', AutorController.newForm);
router.get('/:id/editar', AutorController.editForm);

module.exports = router;

