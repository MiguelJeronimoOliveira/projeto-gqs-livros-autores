describe('Cadastro de Livros - E2E', () => {
  before(() => {
    // Criar um autor para usar nos testes de livros
    cy.request('POST', '/api/autores', {
      nome: 'Autor Teste E2E',
      nacionalidade: 'Brasileira'
    });
  });

  beforeEach(() => {
    cy.visit('/livros/novo');
  });

  it('deve carregar a página de cadastro de livro', () => {
    cy.contains('Cadastrar Novo Livro');
    cy.get('#titulo').should('be.visible');
    cy.get('#isbn').should('be.visible');
    cy.get('#ano_publicacao').should('be.visible');
    cy.get('#genero').should('be.visible');
    cy.get('#numero_paginas').should('be.visible');
    cy.get('#autor_id').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Salvar Livro');
  });

  it('deve carregar lista de autores no select', () => {
    cy.get('#autor_id option').should('have.length.greaterThan', 1);
    cy.get('#autor_id option').first().should('contain', 'Selecione um autor');
  });

  it('deve cadastrar um novo livro com sucesso', () => {
    const livro = {
      titulo: 'O Sítio do Picapau Amarelo',
      isbn: '978-85-359-2222-2',
      ano_publicacao: '1920',
      genero: 'Infantil',
      numero_paginas: '150'
    };

    cy.get('#titulo').type(livro.titulo);
    cy.get('#isbn').type(livro.isbn);
    cy.get('#ano_publicacao').type(livro.ano_publicacao);
    cy.get('#genero').type(livro.genero);
    cy.get('#numero_paginas').type(livro.numero_paginas);
    
    // Selecionar o primeiro autor disponível (não a opção vazia)
    cy.get('#autor_id option').eq(1).then(($option) => {
      cy.get('#autor_id').select($option.val());
    });

    cy.get('button[type="submit"]').click();

    // Verificar mensagem de sucesso
    cy.get('#successAlert').should('be.visible');
    cy.get('#successAlert').should('contain', 'Livro cadastrado com sucesso');

    // Verificar se o formulário foi limpo
    cy.get('#titulo').should('have.value', '');
    cy.get('#isbn').should('have.value', '');
    cy.get('#ano_publicacao').should('have.value', '');
    cy.get('#genero').should('have.value', '');
    cy.get('#numero_paginas').should('have.value', '');
    cy.get('#autor_id').should('have.value', '');
  });

  it('deve exibir erro quando título não é fornecido', () => {
    // Selecionar um autor
    cy.get('#autor_id option').eq(1).then(($option) => {
      cy.get('#autor_id').select($option.val());
    });
    
    cy.get('button[type="submit"]').click();

    // Verificar mensagem de erro
    cy.get('#errorAlert').should('be.visible');
    cy.get('#errorMessage').should('contain', 'obrigatório');
  });

  it('deve exibir erro quando autor não é selecionado', () => {
    cy.get('#titulo').type('Livro Sem Autor');
    cy.get('button[type="submit"]').click();

    // Verificar mensagem de erro
    cy.get('#errorAlert').should('be.visible');
    cy.get('#errorMessage').should('contain', 'obrigatório');
  });

  it('deve permitir cancelar o cadastro', () => {
    cy.get('#titulo').type('Teste');
    cy.contains('Cancelar').click();

    // Verificar se voltou para a página anterior
    cy.url().should('not.contain', '/livros/novo');
  });

  it('deve validar campos obrigatórios no frontend', () => {
    cy.get('button[type="submit"]').click();

    // Os campos título e autor têm required, então o browser deve impedir o submit
    cy.get('#titulo:invalid').should('exist');
  });

  it('deve permitir preencher apenas campos obrigatórios', () => {
    cy.get('#titulo').type('Livro Mínimo');
    
    // Selecionar o primeiro autor disponível
    cy.get('#autor_id option').eq(1).then(($option) => {
      cy.get('#autor_id').select($option.val());
    });
    
    cy.get('button[type="submit"]').click();

    // Verificar mensagem de sucesso
    cy.get('#successAlert').should('be.visible');
  });

  it('deve validar campos numéricos', () => {
    cy.get('#titulo').type('Livro Teste');
    cy.get('#ano_publicacao').type('abc'); // Valor inválido
    
    // Selecionar um autor
    cy.get('#autor_id option').eq(1).then(($option) => {
      cy.get('#autor_id').select($option.val());
    });
    
    cy.get('button[type="submit"]').click();

    // O campo numérico deve ser validado pelo browser
    cy.get('#ano_publicacao').should('have.value', '');
  });

  it('deve fechar alertas quando clicado no botão de fechar', () => {
    // Criar um erro primeiro
    cy.get('button[type="submit"]').click();
    cy.get('#errorAlert').should('be.visible');

    // Fechar o alerta
    cy.get('#errorAlert .btn-close').click();
    cy.get('#errorAlert').should('not.be.visible');
  });
});

