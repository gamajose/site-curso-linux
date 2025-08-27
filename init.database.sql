-- Tabela de certificados
CREATE TABLE certificates (
    id VARCHAR(20) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    curso VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    carga_horaria VARCHAR(20) NOT NULL,
    modalidade VARCHAR(50) NOT NULL,
    organizacao VARCHAR(100) NOT NULL,
    instrutor VARCHAR(100) NOT NULL,
    diretor VARCHAR(100) NOT NULL,
    hash_verificacao VARCHAR(50) NOT NULL,
    download_count INTEGER DEFAULT 0,
    valido BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo
INSERT INTO certificates (id, nome, curso, data, carga_horaria, modalidade, organizacao, instrutor, diretor, hash_verificacao) VALUES
('LINUX2025-001', 'Jorge Akira', 'Curso de Linux', '2025-10-01', '20 horas', 'Online', 'Red Innovations', 'José Moraes', 'Danilo Germano', 'a7b9c3d2e1f4'),
('LINUX2025-002', 'Matheus Cerqueira', 'Curso de Linux', '2025-10-01', '20 horas', 'Online', 'Red Innovations', 'José Moraes', 'Danilo Germano', 'b8c4d5e9f2a6'),
('LINUX2025-003', 'Matheus Godoy', 'Curso de Linux', '2025-10-01', '20 horas', 'Online', 'Red Innovations', 'José Moraes', 'Danilo Germano', 'c9d7e3f1b5a8'),
('LINUX2025-004', 'Willian Gama', 'Curso de Linux', '2025-10-01', '20 horas', 'Online', 'Red Innovations', 'José Moraes', 'Danilo Germano', 'd2e4f6a8b1c3'),
('LINUX2025-005', 'Brian Mendes', 'Curso de Linux', '2025-10-01', '20 horas', 'Online', 'Red Innovations', 'José Moraes', 'Danilo Germano', 'e3f5a7b9c1d2'),
('LINUX2025-006', 'Vitor Silva', 'Curso de Linux', '2025-10-01', '20 horas', 'Online', 'Red Innovations', 'José Moraes', 'Danilo Germano', 'f4a6b8c2d0e1'),
('LINUX2025-007', 'Newman Neto', 'Curso de Linux', '2025-10-01', '20 horas', 'Online', 'Red Innovations', 'José Moraes', 'Danilo Germano', 'a5b7c9d1e3f2'),
('LINUX2025-008', 'Danilo Germano', 'Curso de Linux', '2025-10-01', '20 horas', 'Online', 'Red Innovations', 'José Moraes', 'Danilo Germano', 'b6c8d0e2f4a3'),
('LINUX2025-009', 'Claudio Moreti', 'Curso de Linux', '2025-10-01', '20 horas', 'Online', 'Red Innovations', 'José Moraes', 'Danilo Germano', 'c7d9e1f3a5b4'),
('LINUX2025-010', 'Robson Silva', 'Curso de Linux', '2025-10-01', '20 horas', 'Online', 'Red Innovations', 'José Moraes', 'Danilo Germano', 'd8e0f2a4b6c5');

-- Índices para melhor performance
CREATE INDEX idx_certificates_hash ON certificates(hash_verificacao);
CREATE INDEX idx_certificates_date ON certificates(data);