const Livro = require('../../src/models/Livro');
const pool = require('../../src/database/connection');

// Mock do pool de conexão
jest.mock('../../src/database/connection', () => ({
  query: jest.fn()
}));

describe('Modelo Livro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todos os livros com informações do autor', async () => {
      const mockLivros = [
        { id: 1, titulo: 'Dom Casmurro', autor_nome: 'Machado de Assis' },
        { id: 2, titulo: 'A Hora da Estrela', autor_nome: 'Clarice Lispector' }
      ];

      pool.query.mockResolvedValue({ rows: mockLivros });

      const result = await Livro.findAll();

      expect(pool.query).toHaveBeenCalledWith(`
        SELECT l.*, a.nome as autor_nome 
        FROM livros l 
        LEFT JOIN autores a ON l.autor_id = a.id 
        ORDER BY l.id
      `);
      expect(result).toEqual(mockLivros);
    });

    it('deve lançar erro quando falhar na consulta', async () => {
      pool.query.mockRejectedValue(new Error('Erro de conexão'));

      await expect(Livro.findAll()).rejects.toThrow('Erro ao buscar livros: Erro de conexão');
    });
  });

  describe('findById', () => {
    it('deve retornar um livro específico com informações do autor', async () => {
      const mockLivro = { id: 1, titulo: 'Dom Casmurro', autor_nome: 'Machado de Assis' };

      pool.query.mockResolvedValue({ rows: [mockLivro] });

      const result = await Livro.findById(1);

      expect(pool.query).toHaveBeenCalledWith(`
        SELECT l.*, a.nome as autor_nome 
        FROM livros l 
        LEFT JOIN autores a ON l.autor_id = a.id 
        WHERE l.id = $1
      `, [1]);
      expect(result).toEqual(mockLivro);
    });

    it('deve retornar null quando livro não encontrado', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await Livro.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar um novo livro', async () => {
      const livroData = {
        titulo: 'O Cortiço',
        isbn: '978-85-359-0123-4',
        ano_publicacao: 1890,
        genero: 'Romance',
        numero_paginas: 300,
        autor_id: 1
      };

      const mockLivroCriado = { id: 3, ...livroData };

      // Mock para verificar se autor existe
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      // Mock para criar o livro
      pool.query.mockResolvedValueOnce({ rows: [mockLivroCriado] });

      const result = await Livro.create(livroData);

      expect(pool.query).toHaveBeenCalledWith('SELECT id FROM autores WHERE id = $1', [1]);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO livros (titulo, isbn, ano_publicacao, genero, numero_paginas, autor_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [livroData.titulo, livroData.isbn, livroData.ano_publicacao, livroData.genero, livroData.numero_paginas, livroData.autor_id]
      );
      expect(result).toEqual(mockLivroCriado);
    });

    it('deve lançar erro quando título não fornecido', async () => {
      const livroData = { autor_id: 1 };

      await expect(Livro.create(livroData)).rejects.toThrow('Título é obrigatório');
    });

    it('deve lançar erro quando autor não fornecido', async () => {
      const livroData = { titulo: 'Teste' };

      await expect(Livro.create(livroData)).rejects.toThrow('Autor é obrigatório');
    });

    it('deve lançar erro quando autor não existe', async () => {
      const livroData = { titulo: 'Teste', autor_id: 999 };

      pool.query.mockResolvedValue({ rows: [] });

      await expect(Livro.create(livroData)).rejects.toThrow('Erro ao criar livro: Autor não encontrado');
    });
  });

  describe('update', () => {
    it('deve atualizar um livro existente', async () => {
      const livroData = {
        titulo: 'O Cortiço - Edição Revisada',
        isbn: '978-85-359-0123-4',
        ano_publicacao: 1890,
        genero: 'Romance',
        numero_paginas: 320,
        autor_id: 1
      };

      const mockLivroAtualizado = { id: 1, ...livroData };

      // Mock para verificar se autor existe
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      // Mock para atualizar o livro
      pool.query.mockResolvedValueOnce({ rows: [mockLivroAtualizado] });

      const result = await Livro.update(1, livroData);

      expect(result).toEqual(mockLivroAtualizado);
    });

    it('deve lançar erro quando livro não encontrado', async () => {
      const livroData = { titulo: 'Teste', autor_id: 1 };

      // Mock para verificar se autor existe
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      // Mock para update que não encontra o livro
      pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(Livro.update(999, livroData)).rejects.toThrow('Erro ao atualizar livro: Livro não encontrado');
    });
  });

  describe('delete', () => {
    it('deve deletar um livro existente', async () => {
      const mockLivroDeletado = { id: 1, titulo: 'Dom Casmurro' };

      pool.query.mockResolvedValue({ rows: [mockLivroDeletado] });

      const result = await Livro.delete(1);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM livros WHERE id = $1 RETURNING *', [1]);
      expect(result).toEqual(mockLivroDeletado);
    });

    it('deve lançar erro quando livro não encontrado', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(Livro.delete(999)).rejects.toThrow('Erro ao deletar livro: Livro não encontrado');
    });
  });
});

