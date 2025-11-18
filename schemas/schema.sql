-- Schema for SoccerApp (compatible with both Python and C# backends)
-- This file creates the database tables for the SoccerApp application

-- Drop tables if they exist to ensure clean setup
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS teams;

-- Create Teams table
CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    established_year INTEGER,
    home_stadium TEXT,
    logo_url TEXT,
    club_colors TEXT,
    country TEXT,
    league TEXT,
    current_season_position INTEGER,
    team_value DECIMAL(18,2),
    historical_performance TEXT,
    contact_information TEXT,
    description TEXT,
    wikipedia_link TEXT
);

-- Create Players table with foreign key to Teams
CREATE TABLE players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    date_of_birth TEXT, -- SQLite doesn't have a specific date type, store as ISO format
    nationality TEXT,
    position TEXT,
    jersey_number INTEGER,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    contract_start TEXT, -- SQLite doesn't have a specific date type, store as ISO format
    contract_end TEXT, -- SQLite doesn't have a specific date type, store as ISO format
    salary DECIMAL(18,2),
    player_value DECIMAL(18,2),
    team_id INTEGER NOT NULL,
    photo_url TEXT,
    is_injured BOOLEAN DEFAULT 0,
    injury_details TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 10),
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_teams_country ON teams(country);
CREATE INDEX idx_teams_league ON teams(league);
CREATE INDEX idx_players_nationality ON players(nationality);
CREATE INDEX idx_players_position ON players(position);
