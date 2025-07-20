const request = require('supertest');
const app = require('../../app');
const pool = require('../../src/database/connection');

describe('Endpoints de Livro - Testes de Integração (Mock)', () => {
  describe('GET /api/livros', () => {
    it('deve retornar lista de livros', async () => {
      const mockLivros = [
        { id: 1, titulo: 'Dom Casmurro', autor_nome: 'Machado de Assis' },
        { id: 2, titulo: 'A Hora da Estrela', autor_nome: 'Clarice Lispector' }
      ];

      pool.query.mockResolvedValue({ rows: mockLivros });

      const response = await request(app)
        .get('/api/livros')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(mockLivros);
    });
  });

  describe('POST /api/livros', () => {
    it('deve criar um novo livro com dados válidos', async () => {
      const novoLivro = {
        titulo: 'Livro Teste',
        isbn: '978-85-359-0999-9',
        ano_publicacao: 2023,
        genero: 'Ficção',
        numero_paginas: 250,
        autor_id: 1
      };

      const mockLivroCriado = { id: 1, ...novoLivro };
      
      // Mock para verificar se autor existe
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      // Mock para criar o livro
      pool.query.mockResolvedValueOnce({ rows: [mockLivroCriado] });

      const response = await request(app)
        .post('/api/livros')
        .send(novoLivro)
        .expect(201);

      expect(response.body).toEqual(mockLivroCriado);
    });

    it('deve retornar erro 400 quando título não fornecido', async () => {
      const livroInvalido = {
        autor_id: 1
      };

      const response = await request(app)
        .post('/api/livros')
        .send(livroInvalido)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('obrigatório');
    });

    it('deve retornar erro 400 quando autor não fornecido', async () => {
      const livroInvalido = {
        titulo: 'Livro Sem Autor'
      };

      const response = await request(app)
        .post('/api/livros')
        .send(livroInvalido)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('obrigatório');
    });

    it('deve retornar erro 400 quando autor não existe', async () => {
      const livroInvalido = {
        titulo: 'Livro com Autor Inexistente',
        autor_id: 99999
      };

      // Mock para autor não encontrado
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/livros')
        .send(livroInvalido)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('não encontrado');
    });
  });

  describe('GET /api/livros/:id', () => {
    it('deve retornar livro específico quando ID válido', async () => {
      const mockLivro = { id: 1, titulo: 'Dom Casmurro', autor_nome: 'Machado de Assis' };
      pool.query.mockResolvedValue({ rows: [mockLivro] });

      const response = await request(app)
        .get('/api/livros/1')
        .expect(200);

      expect(response.body).toEqual(mockLivro);
    });

    it('deve retornar erro 404 quando livro não encontrado', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .get('/api/livros/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('não encontrado');
    });
  });

  describe('PUT /api/livros/:id', () => {
    it('deve atualizar livro existente', async () => {
      const dadosAtualizados = {
        titulo: 'Livro Atualizado',
        genero: 'Romance',
        numero_paginas: 300,
        autor_id: 1
      };

      const mockLivroAtualizado = { id: 1, ...dadosAtualizados };
      
      // Mock para verificar se autor existe
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      // Mock para atualizar o livro
      pool.query.mockResolvedValueOnce({ rows: [mockLivroAtualizado] });

      const response = await request(app)
        .put('/api/livros/1')
        .send(dadosAtualizados)
        .expect(200);

      expect(response.body).toEqual(mockLivroAtualizado);
    });

    it('deve retornar erro 404 quando livro não encontrado', async () => {
      const dadosAtualizados = {
        titulo: 'Livro Inexistente',
        autor_id: 1
      };

      // Mock para verificar se autor existe
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      // Mock para update que não encontra o livro
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/api/livros/99999')
        .send(dadosAtualizados)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/livros/:id', () => {
    it('deve deletar livro existente', async () => {
      const mockLivroDeletado = { id: 1, titulo: 'Livro Para Deletar' };
      pool.query.mockResolvedValue({ rows: [mockLivroDeletado] });

      await request(app)
        .delete('/api/livros/1')
        .expect(204);
    });

    it('deve retornar erro 404 quando livro não encontrado', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .delete('/api/livros/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});

