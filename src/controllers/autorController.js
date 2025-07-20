const Autor = require('../models/Autor');

class AutorController {
  // GET /autores
  static async index(req, res) {
    try {
      const autores = await Autor.findAll();
      res.json(autores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /autores/:id
  static async show(req, res) {
    try {
      const { id } = req.params;
      const autor = await Autor.findById(id);
      
      if (!autor) {
        return res.status(404).json({ error: 'Autor não encontrado' });
      }
      
      res.json(autor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /autores
  static async create(req, res) {
    try {
      const autor = await Autor.create(req.body);
      res.status(201).json(autor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // PUT /autores/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const autor = await Autor.update(id, req.body);
      res.json(autor);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /autores/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await Autor.delete(id);
      res.status(204).send();
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // GET /autores/novo
  static async newForm(req, res) {
    res.render('autores/novo');
  }

  // GET /autores/:id/editar
  static async editForm(req, res) {
    try {
      const { id } = req.params;
      const autor = await Autor.findById(id);
      
      if (!autor) {
        return res.status(404).render('error', { message: 'Autor não encontrado' });
      }
      
      res.render('autores/editar', { autor });
    } catch (error) {
      res.status(500).render('error', { message: error.message });
    }
  }
}

module.exports = AutorController;

