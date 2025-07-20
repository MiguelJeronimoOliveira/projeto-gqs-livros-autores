const pool = require('../database/connection');

class Autor {
  constructor(id, nome, nacionalidade, data_nascimento, biografia) {
    this.id = id;
    this.nome = nome;
    this.nacionalidade = nacionalidade;
    this.data_nascimento = data_nascimento;
    this.biografia = biografia;
  }

  static async findAll() {
    try {
      const result = await pool.query('SELECT * FROM autores ORDER BY id');
      return result.rows;
    } catch (error) {
      throw new Error('Erro ao buscar autores: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM autores WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error('Erro ao buscar autor: ' + error.message);
    }
  }

  static async create(autorData) {
    const { nome, nacionalidade, data_nascimento, biografia } = autorData;
    
    if (!nome) {
      throw new Error('Nome é obrigatório');
    }

    try {
      const result = await pool.query(
        'INSERT INTO autores (nome, nacionalidade, data_nascimento, biografia) VALUES ($1, $2, $3, $4) RETURNING *',
        [nome, nacionalidade, data_nascimento, biografia]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error('Erro ao criar autor: ' + error.message);
    }
  }

  static async update(id, autorData) {
    const { nome, nacionalidade, data_nascimento, biografia } = autorData;
    
    if (!nome) {
      throw new Error('Nome é obrigatório');
    }

    try {
      const result = await pool.query(
        'UPDATE autores SET nome = $1, nacionalidade = $2, data_nascimento = $3, biografia = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
        [nome, nacionalidade, data_nascimento, biografia, id]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Autor não encontrado');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error('Erro ao atualizar autor: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM autores WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Autor não encontrado');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error('Erro ao deletar autor: ' + error.message);
    }
  }
}

module.exports = Autor;

