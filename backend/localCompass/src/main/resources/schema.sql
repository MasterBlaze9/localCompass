-- Preserve app_user data but clean all other tables
-- Set building references to NULL before deleting buildings
UPDATE app_user SET building_id = NULL;

-- Delete dependent records (respecting foreign key constraints)
DELETE FROM event_attendee;
DELETE FROM post_acceptance;
DELETE FROM post;
DELETE FROM report;
DELETE FROM event;
DELETE FROM building;
DELETE FROM condominium;

-- Migrations
ALTER TABLE app_user ALTER COLUMN building_id DROP NOT NULL;
ALTER TABLE report ADD COLUMN IF NOT EXISTS title VARCHAR(255);