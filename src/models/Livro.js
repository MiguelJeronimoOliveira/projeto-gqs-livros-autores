const pool = require('../database/connection');

class Livro {
  constructor(id, titulo, isbn, ano_publicacao, genero, numero_paginas, autor_id) {
    this.id = id;
    this.titulo = titulo;
    this.isbn = isbn;
    this.ano_publicacao = ano_publicacao;
    this.genero = genero;
    this.numero_paginas = numero_paginas;
    this.autor_id = autor_id;
  }

  static async findAll() {
    try {
      const result = await pool.query(`
        SELECT l.*, a.nome as autor_nome 
        FROM livros l 
        LEFT JOIN autores a ON l.autor_id = a.id 
        ORDER BY l.id
      `);
      return result.rows;
    } catch (error) {
      throw new Error('Erro ao buscar livros: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(`
        SELECT l.*, a.nome as autor_nome 
        FROM livros l 
        LEFT JOIN autores a ON l.autor_id = a.id 
        WHERE l.id = $1
      `, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Erro ao buscar livro: ' + error.message);
    }
  }

  static async create(livroData) {
    const { titulo, isbn, ano_publicacao, genero, numero_paginas, autor_id } = livroData;
    
    if (!titulo) {
      throw new Error('Título é obrigatório');
    }

    if (!autor_id) {
      throw new Error('Autor é obrigatório');
    }

    try {
      // Verificar se o autor existe
      const autorExists = await pool.query('SELECT id FROM autores WHERE id = $1', [autor_id]);
      if (autorExists.rows.length === 0) {
        throw new Error('Autor não encontrado');
      }

      const result = await pool.query(
        'INSERT INTO livros (titulo, isbn, ano_publicacao, genero, numero_paginas, autor_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [titulo, isbn, ano_publicacao, genero, numero_paginas, autor_id]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('ISBN já existe');
      }
      throw new Error('Erro ao criar livro: ' + error.message);
    }
  }

  static async update(id, livroData) {
    const { titulo, isbn, ano_publicacao, genero, numero_paginas, autor_id } = livroData;
    
    if (!titulo) {
      throw new Error('Título é obrigatório');
    }

    if (!autor_id) {
      throw new Error('Autor é obrigatório');
    }

    try {
      // Verificar se o autor existe
      const autorExists = await pool.query('SELECT id FROM autores WHERE id = $1', [autor_id]);
      if (autorExists.rows.length === 0) {
        throw new Error('Autor não encontrado');
      }

      const result = await pool.query(
        'UPDATE livros SET titulo = $1, isbn = $2, ano_publicacao = $3, genero = $4, numero_paginas = $5, autor_id = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
        [titulo, isbn, ano_publicacao, genero, numero_paginas, autor_id, id]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Livro não encontrado');
      }
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('ISBN já existe');
      }
      throw new Error('Erro ao atualizar livro: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM livros WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Livro não encontrado');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error('Erro ao deletar livro: ' + error.message);
    }
  }
}

module.exports = Livro;

