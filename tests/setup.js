// Mock do pool de conexão para todos os testes de integração
jest.mock('../src/database/connection', () => {
  const mockPool = {
    query: jest.fn()
  };
  
  return mockPool;
});

// Configuração global para testes
beforeEach(() => {
  jest.clearAllMocks();
});

