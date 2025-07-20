const request = require('supertest');
const app = require('../../app');
const pool = require('../../src/database/connection');

describe('Endpoints de Autor - Testes de Integração (Mock)', () => {
  describe('GET /api/autores', () => {
    it('deve retornar lista de autores', async () => {
      const mockAutores = [
        { id: 1, nome: 'Machado de Assis', nacionalidade: 'Brasileira' },
        { id: 2, nome: 'Clarice Lispector', nacionalidade: 'Brasileira' }
      ];

      pool.query.mockResolvedValue({ rows: mockAutores });

      const response = await request(app)
        .get('/api/autores')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(mockAutores);
    });
  });

  describe('POST /api/autores', () => {
    it('deve criar um novo autor com dados válidos', async () => {
      const novoAutor = {
        nome: 'Jorge Amado',
        nacionalidade: 'Brasileira',
        data_nascimento: '1912-08-10',
        biografia: 'Escritor brasileiro'
      };

      const mockAutorCriado = { id: 1, ...novoAutor };
      pool.query.mockResolvedValue({ rows: [mockAutorCriado] });

      const response = await request(app)
        .post('/api/autores')
        .send(novoAutor)
        .expect(201);

      expect(response.body).toEqual(mockAutorCriado);
    });

    it('deve retornar erro 400 quando nome não fornecido', async () => {
      const autorInvalido = {
        nacionalidade: 'Brasileira'
      };

      const response = await request(app)
        .post('/api/autores')
        .send(autorInvalido)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('obrigatório');
    });
  });

  describe('GET /api/autores/:id', () => {
    it('deve retornar autor específico quando ID válido', async () => {
      const mockAutor = { id: 1, nome: 'Machado de Assis', nacionalidade: 'Brasileira' };
      pool.query.mockResolvedValue({ rows: [mockAutor] });

      const response = await request(app)
        .get('/api/autores/1')
        .expect(200);

      expect(response.body).toEqual(mockAutor);
    });

    it('deve retornar erro 404 quando autor não encontrado', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .get('/api/autores/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('não encontrado');
    });
  });

  describe('PUT /api/autores/:id', () => {
    it('deve atualizar autor existente', async () => {
      const dadosAtualizados = {
        nome: 'Graciliano Ramos de Oliveira',
        nacionalidade: 'Brasileira',
        biografia: 'Escritor brasileiro do modernismo'
      };

      const mockAutorAtualizado = { id: 1, ...dadosAtualizados };
      pool.query.mockResolvedValue({ rows: [mockAutorAtualizado] });

      const response = await request(app)
        .put('/api/autores/1')
        .send(dadosAtualizados)
        .expect(200);

      expect(response.body).toEqual(mockAutorAtualizado);
    });

    it('deve retornar erro 404 quando autor não encontrado', async () => {
      const dadosAtualizados = {
        nome: 'Autor Inexistente'
      };

      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/autores/99999')
        .send(dadosAtualizados)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/autores/:id', () => {
    it('deve deletar autor existente', async () => {
      const mockAutorDeletado = { id: 1, nome: 'Autor Para Deletar' };
      pool.query.mockResolvedValue({ rows: [mockAutorDeletado] });

      await request(app)
        .delete('/api/autores/1')
        .expect(204);
    });

    it('deve retornar erro 404 quando autor não encontrado', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .delete('/api/autores/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});

