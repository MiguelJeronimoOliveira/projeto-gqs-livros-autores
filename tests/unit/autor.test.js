const Autor = require('../../src/models/Autor');
const pool = require('../../src/database/connection');

// Mock do pool de conexão
jest.mock('../../src/database/connection', () => ({
  query: jest.fn()
}));

describe('Modelo Autor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todos os autores', async () => {
      const mockAutores = [
        { id: 1, nome: 'Machado de Assis', nacionalidade: 'Brasileira' },
        { id: 2, nome: 'Clarice Lispector', nacionalidade: 'Brasileira' }
      ];

      pool.query.mockResolvedValue({ rows: mockAutores });

      const result = await Autor.findAll();

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM autores ORDER BY id');
      expect(result).toEqual(mockAutores);
    });

    it('deve lançar erro quando falhar na consulta', async () => {
      pool.query.mockRejectedValue(new Error('Erro de conexão'));

      await expect(Autor.findAll()).rejects.toThrow('Erro ao buscar autores: Erro de conexão');
    });
  });

  describe('findById', () => {
    it('deve retornar um autor específico', async () => {
      const mockAutor = { id: 1, nome: 'Machado de Assis', nacionalidade: 'Brasileira' };

      pool.query.mockResolvedValue({ rows: [mockAutor] });

      const result = await Autor.findById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM autores WHERE id = $1', [1]);
      expect(result).toEqual(mockAutor);
    });

    it('deve retornar null quando autor não encontrado', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await Autor.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar um novo autor', async () => {
      const autorData = {
        nome: 'José Saramago',
        nacionalidade: 'Portuguesa',
        data_nascimento: '1922-11-16',
        biografia: 'Escritor português'
      };

      const mockAutorCriado = { id: 3, ...autorData };

      pool.query.mockResolvedValue({ rows: [mockAutorCriado] });

      const result = await Autor.create(autorData);

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO autores (nome, nacionalidade, data_nascimento, biografia) VALUES ($1, $2, $3, $4) RETURNING *',
        [autorData.nome, autorData.nacionalidade, autorData.data_nascimento, autorData.biografia]
      );
      expect(result).toEqual(mockAutorCriado);
    });

    it('deve lançar erro quando nome não fornecido', async () => {
      const autorData = { nacionalidade: 'Portuguesa' };

      await expect(Autor.create(autorData)).rejects.toThrow('Nome é obrigatório');
    });
  });

  describe('update', () => {
    it('deve atualizar um autor existente', async () => {
      const autorData = {
        nome: 'José Saramago',
        nacionalidade: 'Portuguesa',
        data_nascimento: '1922-11-16',
        biografia: 'Escritor português atualizado'
      };

      const mockAutorAtualizado = { id: 1, ...autorData };

      pool.query.mockResolvedValue({ rows: [mockAutorAtualizado] });

      const result = await Autor.update(1, autorData);

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE autores SET nome = $1, nacionalidade = $2, data_nascimento = $3, biografia = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
        [autorData.nome, autorData.nacionalidade, autorData.data_nascimento, autorData.biografia, 1]
      );
      expect(result).toEqual(mockAutorAtualizado);
    });

    it('deve lançar erro quando autor não encontrado', async () => {
      const autorData = { nome: 'Teste' };

      pool.query.mockResolvedValue({ rows: [] });

      await expect(Autor.update(999, autorData)).rejects.toThrow('Erro ao atualizar autor: Autor não encontrado');
    });
  });

  describe('delete', () => {
    it('deve deletar um autor existente', async () => {
      const mockAutorDeletado = { id: 1, nome: 'Machado de Assis' };

      pool.query.mockResolvedValue({ rows: [mockAutorDeletado] });

      const result = await Autor.delete(1);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM autores WHERE id = $1 RETURNING *', [1]);
      expect(result).toEqual(mockAutorDeletado);
    });

    it('deve lançar erro quando autor não encontrado', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(Autor.delete(999)).rejects.toThrow('Erro ao deletar autor: Autor não encontrado');
    });
  });
});

