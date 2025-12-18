-- Dummy data for localCompass application
-- This file populates the database with sample data for testing and development

-- Insert Condominiums
INSERT INTO condominium (id, name) VALUES (1, 'Condominio Central') ON CONFLICT DO NOTHING;
INSERT INTO condominium (id, name) VALUES (2, 'Residencial Park') ON CONFLICT DO NOTHING;

-- Insert Buildings
INSERT INTO building (id, name, total_units, condominium_id) VALUES (1, 'Building A', 20, 1) ON CONFLICT DO NOTHING;
INSERT INTO building (id, name, total_units, condominium_id) VALUES (2, 'Building B', 15, 1) ON CONFLICT DO NOTHING;
INSERT INTO building (id, name, total_units, condominium_id) VALUES (3, 'Tower 1', 30, 2) ON CONFLICT DO NOTHING;

-- Insert Users (keeping existing ones, adding new dummy users)
INSERT INTO app_user (id, first_name, last_name, email, password, unit_number, phone_number, is_admin, building_id, created_at) 
VALUES (101, 'João', 'Silva', 'joao.silva@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv3m', 'A-101', '911234567', true, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO app_user (id, first_name, last_name, email, password, unit_number, phone_number, is_admin, building_id, created_at) 
VALUES (102, 'Maria', 'Santos', 'maria.santos@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv3m', 'A-102', '912345678', false, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO app_user (id, first_name, last_name, email, password, unit_number, phone_number, is_admin, building_id, created_at) 
VALUES (103, 'Pedro', 'Oliveira', 'pedro.oliveira@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv3m', 'A-103', '913456789', false, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO app_user (id, first_name, last_name, email, password, unit_number, phone_number, is_admin, building_id, created_at) 
VALUES (104, 'Ana', 'Costa', 'ana.costa@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv3m', 'A-104', '914567890', false, 1, NOW()) 
ON CONFLICT DO NOTHING;

-- Update all users to have building_id = 1
UPDATE app_user SET building_id = 1 WHERE building_id IS NULL;

-- Insert Posts
INSERT INTO post (id, title, content, status, user_id, building_id, created_at) 
VALUES (1, 'Manutenção de elevador prevista', 'O elevador do prédio passará por manutenção no próximo dia 25.', 'OPEN', 101, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO post (id, title, content, status, user_id, building_id, created_at) 
VALUES (2, 'Reunião de condomínio', 'Convida-se para a assembleia geral no dia 30 às 18h na sala de convívio.', 'OPEN', 101, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO post (id, title, content, status, user_id, building_id, created_at) 
VALUES (3, 'Problema na rede de água', 'Há interrupção na distribuição de água no bloco B. Equipas estão a trabalhar no assunto.', 'IN_PROGRESS', 103, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO post (id, title, content, status, user_id, building_id, created_at) 
VALUES (4, 'Limpeza das áreas comuns', 'Informamos que a limpeza das áreas comuns foi concluída com sucesso.', 'CLOSED', 104, 1, NOW()) 
ON CONFLICT DO NOTHING;

-- Insert Events
INSERT INTO event (id, title, description, location, datetime, status, user_id, building_id, created_at) 
VALUES (1, 'Festa de Natal do Condomínio', 'Celebração de Natal com música, comida e bebidas para todos os residentes.', 'Sala de Convívio - Building A', '2024-12-20 18:00:00', 'SCHEDULED', 101, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO event (id, title, description, location, datetime, status, user_id, building_id, created_at) 
VALUES (2, 'Aula de Yoga', 'Sessão de yoga matinal para todos os interessados. Leve tapete de yoga.', 'Parque - Building A', '2024-12-22 09:00:00', 'SCHEDULED', 102, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO event (id, title, description, location, datetime, status, user_id, building_id, created_at) 
VALUES (3, 'Reunião de Vizinhos', 'Encontro informal para conhecer melhor os vizinhos do bloco.', 'Terraço - Building B', '2024-12-21 19:00:00', 'SCHEDULED', 103, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO event (id, title, description, location, datetime, status, user_id, building_id, created_at) 
VALUES (4, 'Campeonato de Futsal', 'Torneio amigável de futsal entre residentes. Inscrições abertas!', 'Ginásio - Tower 1', '2024-12-28 17:00:00', 'SCHEDULED', 104, 1, NOW()) 
ON CONFLICT DO NOTHING;

-- Insert Event Attendees
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (1, 101, 1) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (2, 102, 1) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (3, 103, 1) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (4, 102, 2) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (5, 104, 2) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (6, 103, 3) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (7, 104, 4) ON CONFLICT DO NOTHING;

-- Insert Reports
INSERT INTO report (id, title, description, location_details, status, user_id, building_id, created_at) 
VALUES (1, 'Lâmpada danificada no corredor', 'A lâmpada do piso 2 não está funcionando há alguns dias.', 'Corredor Piso 2', 'OPEN', 102, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO report (id, title, description, location_details, status, user_id, building_id, created_at) 
VALUES (2, 'Porta de acesso danificada', 'A porta da cave não abre e fecha corretamente.', 'Cave - Porta Principal', 'OPEN', 103, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO report (id, title, description, location_details, status, user_id, building_id, created_at) 
VALUES (3, 'Caixa de correio quebrada', 'A caixa de correio do piso 3 necessita reparação.', 'Piso 3 - Hall', 'CLOSED', 104, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO report (id, title, description, location_details, status, user_id, building_id, created_at) 
VALUES (4, 'Infiltração de água', 'Deteção de infiltração de água no teto do salão de convívio.', 'Salão de Convívio', 'IN_PROGRESS', 101, 1, NOW()) 
ON CONFLICT DO NOTHING;

-- Insert Post Acceptances (users accepting/completing posts)
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (1, 102, 1, 'PRESENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (2, 103, 1, 'PRESENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (3, 104, 2, 'PRESENT') ON CONFLICT DO NOTHING;

-- Additional Users for new posts/events/reports
INSERT INTO app_user (id, first_name, last_name, email, password, unit_number, phone_number, is_admin, building_id, created_at) 
VALUES (1, 'Admin', 'User', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv3m', 'A-001', '910000000', true, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO app_user (id, first_name, last_name, email, password, unit_number, phone_number, is_admin, building_id, created_at) 
VALUES (2, 'Carlos', 'Mendes', 'carlos.mendes@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv3m', 'B-201', '911111111', false, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO app_user (id, first_name, last_name, email, password, unit_number, phone_number, is_admin, building_id, created_at) 
VALUES (4, 'Fernanda', 'Rocha', 'fernanda.rocha@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv3m', 'C-302', '912222222', false, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO app_user (id, first_name, last_name, email, password, unit_number, phone_number, is_admin, building_id, created_at) 
VALUES (27, 'Tiago', 'Baptista', 'tiago.baptista@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMv3m', 'D-403', '913333333', false, 1, NOW()) 
ON CONFLICT DO NOTHING;

-- Additional Posts from users 1, 2, 4, 27
INSERT INTO post (id, title, content, status, user_id, building_id, created_at) 
VALUES (5, 'Reserva de ginásio', 'O ginásio estará disponível para reserva a partir de segunda-feira.', 'OPEN', 1, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO post (id, title, content, status, user_id, building_id, created_at) 
VALUES (6, 'Horário de recolha de lixo alterado', 'A partir de esta semana, o lixo será recolhido às 18h em vez das 17h.', 'OPEN', 2, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO post (id, title, content, status, user_id, building_id, created_at) 
VALUES (7, 'Aviso de obras na fachada', 'As obras de pintura da fachada terão início no próximo mês. Esperamos possível ruído.', 'IN_PROGRESS', 4, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO post (id, title, content, status, user_id, building_id, created_at) 
VALUES (8, 'Reembolso de despesas comuns', 'Comunica-se que o reembolso de despesas foi processado para todas as unidades.', 'CLOSED', 27, 1, NOW()) 
ON CONFLICT DO NOTHING;

-- Additional Events from users 1, 2, 4, 27
INSERT INTO event (id, title, description, location, datetime, status, user_id, building_id, created_at) 
VALUES (5, 'Torneio de Ténis', 'Campeonato de ténis entre residentes. Todos bem-vindos!', 'Quadra de Ténis', '2024-12-29 14:00:00', 'SCHEDULED', 1, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO event (id, title, description, location, datetime, status, user_id, building_id, created_at) 
VALUES (6, 'Cine-Clube: Noite de Filmes', 'Sessão de cinema com filmes em destaque. Pipocas e refrigerantes disponíveis.', 'Sala de Cinema', '2024-12-22 20:00:00', 'SCHEDULED', 2, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO event (id, title, description, location, datetime, status, user_id, building_id, created_at) 
VALUES (7, 'Aula de Culinária', 'Aprender a fazer pratos tradicionais com o chef convidado. Lugar limitado!', 'Cozinha Comunitária', '2024-12-23 17:00:00', 'SCHEDULED', 4, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO event (id, title, description, location, datetime, status, user_id, building_id, created_at) 
VALUES (8, 'Passeio Comunitário', 'Caminhada pelo bairro seguida de piquenique. Saída às 10h.', 'Parque Vizinho', '2024-12-24 10:00:00', 'SCHEDULED', 27, 1, NOW()) 
ON CONFLICT DO NOTHING;

-- Additional Event Attendees
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (8, 1, 5) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (9, 2, 5) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (10, 1, 6) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (11, 4, 6) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (12, 27, 6) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (13, 2, 7) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (14, 27, 7) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (15, 1, 8) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (16, 4, 8) ON CONFLICT DO NOTHING;

-- Additional Reports from users 1, 2, 4, 27
INSERT INTO report (id, title, description, location_details, status, user_id, building_id, created_at) 
VALUES (5, 'Vidro da janela rachado', 'Uma das janelas do corredor tem um vidro rachado. Potencial perigo.', 'Corredor Piso 4', 'OPEN', 1, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO report (id, title, description, location_details, status, user_id, building_id, created_at) 
VALUES (6, 'Banco do parque quebrado', 'Um dos bancos da zona de lazer tem o assento danificado.', 'Parque Comum', 'OPEN', 2, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO report (id, title, description, location_details, status, user_id, building_id, created_at) 
VALUES (7, 'Escada de emergência com dano', 'Degraus da escada de emergência com irregularidade.', 'Escada de Emergência B', 'IN_PROGRESS', 4, 1, NOW()) 
ON CONFLICT DO NOTHING;

INSERT INTO report (id, title, description, location_details, status, user_id, building_id, created_at) 
VALUES (8, 'Fiação elétrica exposta', 'Fios elétricos expostos próximo à entrada. Risco de segurança.', 'Entrada Principal', 'CLOSED', 27, 1, NOW()) 
ON CONFLICT DO NOTHING;

-- Post Acceptances for users 1, 2, 4, 27
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (4, 1, 1, 'PRESENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (5, 1, 2, 'PRESENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (6, 1, 3, 'PRESENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (7, 2, 1, 'PRESENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (8, 2, 4, 'PRESENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (9, 2, 6, 'PRESENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (10, 4, 2, 'PRESENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (11, 4, 3, 'PRESENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (12, 4, 7, 'PRESENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (13, 27, 4, 'PRESENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (14, 27, 5, 'ABSENT') ON CONFLICT DO NOTHING;
INSERT INTO post_acceptance (id, user_id, post_id, status) 
VALUES (15, 27, 8, 'PRESENT') ON CONFLICT DO NOTHING;

-- Additional Event Attendees for users 1, 2, 4, 27 to existing events
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (17, 1, 1) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (18, 1, 2) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (19, 2, 3) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (20, 2, 4) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (21, 4, 1) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (22, 4, 3) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (23, 4, 5) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (24, 27, 1) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (25, 27, 2) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (26, 27, 3) ON CONFLICT DO NOTHING;
INSERT INTO event_attendee (id, user_id, event_id) 
VALUES (27, 27, 4) ON CONFLICT DO NOTHING;
