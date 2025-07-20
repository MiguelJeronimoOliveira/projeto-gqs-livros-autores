const Livro = require('../models/Livro');
const Autor = require('../models/Autor');

class LivroController {
  // GET /livros
  static async index(req, res) {
    try {
      const livros = await Livro.findAll();
      res.json(livros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /livros/:id
  static async show(req, res) {
    try {
      const { id } = req.params;
      const livro = await Livro.findById(id);
      
      if (!livro) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      res.json(livro);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /livros
  static async create(req, res) {
    try {
      const livro = await Livro.create(req.body);
      res.status(201).json(livro);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // PUT /livros/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const livro = await Livro.update(id, req.body);
      res.json(livro);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /livros/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await Livro.delete(id);
      res.status(204).send();
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // GET /livros/novo
  static async newForm(req, res) {
    try {
      const autores = await Autor.findAll();
      res.render('livros/novo', { autores });
    } catch (error) {
      res.status(500).render('error', { message: error.message });
    }
  }

  // GET /livros/:id/editar
  static async editForm(req, res) {
    try {
      const { id } = req.params;
      const livro = await Livro.findById(id);
      const autores = await Autor.findAll();
      
      if (!livro) {
        return res.status(404).render('error', { message: 'Livro não encontrado' });
      }
      
      res.render('livros/editar', { livro, autores });
    } catch (error) {
      res.status(500).render('error', { message: error.message });
    }
  }
}

module.exports = LivroController;

