-- Criação do banco de dados
CREATE DATABASE livros_autores_db;

-- Conectar ao banco criado
\c livros_autores_db;

-- Tabela de autores
CREATE TABLE autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nacionalidade VARCHAR(100),
    data_nascimento DATE,
    biografia TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de livros
CREATE TABLE livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    ano_publicacao INTEGER,
    genero VARCHAR(100),
    numero_paginas INTEGER,
    autor_id INTEGER REFERENCES autores(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir alguns dados de exemplo
INSERT INTO autores (nome, nacionalidade, data_nascimento, biografia) VALUES
('Machado de Assis', 'Brasileira', '1839-06-21', 'Joaquim Maria Machado de Assis foi um escritor brasileiro, considerado um dos maiores nomes da literatura brasileira.'),
('Clarice Lispector', 'Brasileira', '1920-12-10', 'Clarice Lispector foi uma escritora e jornalista brasileira nascida na Ucrânia.');

INSERT INTO livros (titulo, isbn, ano_publicacao, genero, numero_paginas, autor_id) VALUES
('Dom Casmurro', '978-85-359-0277-5', 1899, 'Romance', 256, 1),
('A Hora da Estrela', '978-85-359-0123-5', 1977, 'Romance', 87, 2);

