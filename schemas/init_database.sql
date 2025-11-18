-- Initialize database script
-- This script combines schema creation and sample data insertion

-- First, include the schema
.read schema.sql

-- Then, include the sample data
.read sample_data.sql

-- Display confirmation message
SELECT 'Database initialized successfully with schema and sample data!' AS Message;
