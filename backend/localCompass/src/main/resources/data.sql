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
