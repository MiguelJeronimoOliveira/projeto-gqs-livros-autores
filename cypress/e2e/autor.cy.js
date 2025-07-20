describe('Cadastro de Autores - E2E', () => {
  beforeEach(() => {
    cy.visit('/autores/novo');
  });

  it('deve carregar a página de cadastro de autor', () => {
    cy.contains('Cadastrar Novo Autor');
    cy.get('#nome').should('be.visible');
    cy.get('#nacionalidade').should('be.visible');
    cy.get('#data_nascimento').should('be.visible');
    cy.get('#biografia').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Salvar Autor');
  });

  it('deve cadastrar um novo autor com sucesso', () => {
    const autor = {
      nome: 'Monteiro Lobato',
      nacionalidade: 'Brasileira',
      data_nascimento: '1882-04-18',
      biografia: 'José Bento Renato Monteiro Lobato foi um escritor, editor e tradutor brasileiro.'
    };

    cy.get('#nome').type(autor.nome);
    cy.get('#nacionalidade').type(autor.nacionalidade);
    cy.get('#data_nascimento').type(autor.data_nascimento);
    cy.get('#biografia').type(autor.biografia);

    cy.get('button[type="submit"]').click();

    // Verificar mensagem de sucesso
    cy.get('#successAlert').should('be.visible');
    cy.get('#successAlert').should('contain', 'Autor cadastrado com sucesso');

    // Verificar se o formulário foi limpo
    cy.get('#nome').should('have.value', '');
    cy.get('#nacionalidade').should('have.value', '');
    cy.get('#data_nascimento').should('have.value', '');
    cy.get('#biografia').should('have.value', '');
  });

  it('deve exibir erro quando nome não é fornecido', () => {
    cy.get('#nacionalidade').type('Brasileira');
    cy.get('button[type="submit"]').click();

    // Verificar mensagem de erro
    cy.get('#errorAlert').should('be.visible');
    cy.get('#errorMessage').should('contain', 'obrigatório');
  });

  it('deve permitir cancelar o cadastro', () => {
    cy.get('#nome').type('Teste');
    cy.contains('Cancelar').click();

    // Verificar se voltou para a página anterior (pode ser a home)
    cy.url().should('not.contain', '/autores/novo');
  });

  it('deve validar campos obrigatórios no frontend', () => {
    cy.get('button[type="submit"]').click();

    // O campo nome tem required, então o browser deve impedir o submit
    cy.get('#nome:invalid').should('exist');
  });

  it('deve permitir preencher apenas campos obrigatórios', () => {
    cy.get('#nome').type('Autor Mínimo');
    cy.get('button[type="submit"]').click();

    // Verificar mensagem de sucesso
    cy.get('#successAlert').should('be.visible');
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

