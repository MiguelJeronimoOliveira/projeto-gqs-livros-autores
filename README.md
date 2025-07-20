# Sistema de Cadastro de Livros e Autores

Este é um projeto desenvolvido para a disciplina TAD0203 - Gestão da Qualidade de Software, implementando uma aplicação web com arquitetura MVC para cadastro de livros e autores, incluindo testes unitários, de integração e E2E.

## 🎯 Objetivo

Desenvolver uma aplicação web com estrutura MVC, contendo duas views de cadastro com persistência em banco de dados PostgreSQL, e aplicar testes de:
- Unidade e/ou Integração para todos os endpoints da API (CRUD)
- Interface com Cypress (E2E) para validação das views

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js com Express
- **Banco de Dados**: PostgreSQL
- **Template Engine**: EJS
- **Testes**: Jest e Supertest (unitários/integração), Cypress (E2E)
- **Frontend**: HTML, CSS (Bootstrap), JavaScript

## 📁 Estrutura do Projeto

```
projeto-gqs-livros-autores/
├── src/
│   ├── controllers/          # Controladores (MVC)
│   │   ├── autorController.js
│   │   └── livroController.js
│   ├── models/              # Modelos (MVC)
│   │   ├── Autor.js
│   │   └── Livro.js
│   ├── routes/              # Rotas da aplicação
│   │   ├── autorRoutes.js
│   │   └── livroRoutes.js
│   ├── views/               # Views (MVC)
│   │   ├── autores/
│   │   │   └── novo.ejs
│   │   ├── livros/
│   │   │   └── novo.ejs
│   │   ├── layout.ejs
│   │   └── index.ejs
│   ├── public/              # Arquivos estáticos
│   └── database/            # Configuração do banco
│       ├── connection.js
│       └── init.sql
├── tests/
│   ├── unit/                # Testes unitários
│   │   ├── autor.test.js
│   │   └── livro.test.js
│   └── integration/         # Testes de integração
│       ├── autor.integration.test.js
│       └── livro.integration.test.js
├── cypress/
│   └── e2e/                 # Testes E2E
│       ├── autor.cy.js
│       └── livro.cy.js
├── app.js                   # Arquivo principal
├── package.json
├── cypress.config.js
├── .env                     # Variáveis de ambiente
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd projeto-gqs-livros-autores
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

1. Certifique-se de que o PostgreSQL está rodando
2. Crie o banco de dados e as tabelas:

```bash
# Conecte ao PostgreSQL como superusuário
psql -U postgres

# Execute o script de inicialização
\i src/database/init.sql

# Ou execute manualmente:
CREATE DATABASE livros_autores_db;
```

3. Configure as variáveis de ambiente no arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=livros_autores_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
PORT=3000
```

### 4. Execute a aplicação

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

A aplicação estará disponível em: `http://localhost:3000`

## 🧪 Executando os Testes

### Testes Unitários e de Integração (Jest)

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Testes E2E (Cypress)

```bash
# Abrir interface do Cypress
npm run cypress:open

# Executar testes em modo headless
npm run cypress:run
```

**Importante**: Para os testes E2E, certifique-se de que a aplicação está rodando em `http://localhost:3000` antes de executar os testes.

## 📋 Funcionalidades

### API Endpoints

#### Autores
- `GET /api/autores` - Listar todos os autores
- `GET /api/autores/:id` - Buscar autor por ID
- `POST /api/autores` - Criar novo autor
- `PUT /api/autores/:id` - Atualizar autor
- `DELETE /api/autores/:id` - Deletar autor

#### Livros
- `GET /api/livros` - Listar todos os livros
- `GET /api/livros/:id` - Buscar livro por ID
- `POST /api/livros` - Criar novo livro
- `PUT /api/livros/:id` - Atualizar livro
- `DELETE /api/livros/:id` - Deletar livro

### Views (Interface Web)
- `/` - Página inicial
- `/autores/novo` - Formulário de cadastro de autor
- `/livros/novo` - Formulário de cadastro de livro

## 🧪 Cobertura de Testes

O projeto inclui testes abrangentes que cobrem:

### Testes Unitários
- Validação de modelos (Autor e Livro)
- Casos de sucesso e erro
- Validação de dados obrigatórios
- Tratamento de erros de banco de dados

### Testes de Integração
- Todos os endpoints CRUD
- Validação de dados inválidos
- Casos de erro (404, 400, 500)
- Relacionamentos entre entidades

### Testes E2E
- Navegação nas views de cadastro
- Preenchimento e submissão de formulários
- Validação de mensagens de sucesso/erro
- Interação com elementos da interface

## 🔧 Scripts Disponíveis

- `npm start` - Inicia a aplicação em modo produção
- `npm run dev` - Inicia a aplicação em modo desenvolvimento
- `npm test` - Executa testes unitários e de integração
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Executa testes com relatório de cobertura
- `npm run cypress:open` - Abre interface do Cypress
- `npm run cypress:run` - Executa testes E2E em modo headless

## 📊 Estrutura do Banco de Dados

### Tabela: autores
- `id` (SERIAL PRIMARY KEY)
- `nome` (VARCHAR(255) NOT NULL)
- `nacionalidade` (VARCHAR(100))
- `data_nascimento` (DATE)
- `biografia` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela: livros
- `id` (SERIAL PRIMARY KEY)
- `titulo` (VARCHAR(255) NOT NULL)
- `isbn` (VARCHAR(20) UNIQUE)
- `ano_publicacao` (INTEGER)
- `genero` (VARCHAR(100))
- `numero_paginas` (INTEGER)
- `autor_id` (INTEGER REFERENCES autores(id))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🎨 Interface

A interface utiliza Bootstrap 5 para um design responsivo e moderno, incluindo:
- Formulários com validação
- Mensagens de feedback (sucesso/erro)
- Navegação intuitiva
- Design responsivo para mobile e desktop

## 📝 Observações

- O projeto segue o padrão MVC (Model-View-Controller)
- Utiliza prepared statements para prevenir SQL injection
- Inclui validação tanto no frontend quanto no backend
- Implementa tratamento de erros adequado
- Segue boas práticas de desenvolvimento Node.js

## 👥 Autor

Projeto desenvolvido para a disciplina TAD0203 - Gestão da Qualidade de Software
Curso: Análise e Desenvolvimento de Sistemas
Docente: Joel Santos

