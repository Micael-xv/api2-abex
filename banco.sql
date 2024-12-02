CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,          -- ID único e auto-incrementado
    nome VARCHAR(100) NOT NULL,     -- Nome do usuário
    sobrenome VARCHAR(100) NOT NULL,-- Sobrenome do usuário
    cpf CHAR(11) NOT NULL UNIQUE,   -- CPF único (formato sem pontos ou traços)
    telefone VARCHAR(15),           -- Telefone do usuário (com ou sem formatação)
    email VARCHAR(150) NOT NULL UNIQUE, -- Email único
    senha VARCHAR(255) NOT NULL,    -- Senha criptografada
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data de criação
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Data de última atualização
);