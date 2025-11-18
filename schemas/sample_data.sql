-- Sample data for SoccerApp (compatible with both Python and C# backends)
-- This file populates the database with sample data

-- Sample Teams
INSERT INTO teams (name, established_year, home_stadium, logo_url, club_colors, country, league, current_season_position, team_value, historical_performance, contact_information, description, wikipedia_link)
VALUES 
('FC Barcelona', 1899, 'Camp Nou', 'https://example.com/barcelona.png', 'Blue and Red', 'Spain', 'La Liga', 2, 1250000000.00, 'Champions League winners: 5', 'info@fcbarcelona.com', 'One of the most successful clubs in Spanish and European football', 'https://en.wikipedia.org/wiki/FC_Barcelona'),
('Manchester United', 1878, 'Old Trafford', 'https://example.com/manutd.png', 'Red and White', 'England', 'Premier League', 4, 1100000000.00, 'Premier League titles: 20', 'info@manutd.com', 'English club based in Manchester, one of the most successful teams in English football', 'https://en.wikipedia.org/wiki/Manchester_United_F.C.'),
('Bayern Munich', 1900, 'Allianz Arena', 'https://example.com/bayern.png', 'Red and Blue', 'Germany', 'Bundesliga', 1, 1050000000.00, 'Bundesliga champions: 31', 'info@fcbayern.com', 'Most successful club in German football history', 'https://en.wikipedia.org/wiki/FC_Bayern_Munich'),
('Juventus', 1897, 'Juventus Stadium', 'https://example.com/juventus.png', 'Black and White', 'Italy', 'Serie A', 3, 950000000.00, 'Serie A titles: 36', 'info@juventus.com', 'Most successful club in Italian football', 'https://en.wikipedia.org/wiki/Juventus_F.C.'),
('Paris Saint-Germain', 1970, 'Parc des Princes', 'https://example.com/psg.png', 'Blue and Red', 'France', 'Ligue 1', 1, 900000000.00, 'Ligue 1 champions: 10', 'info@psg.fr', 'One of the most prestigious clubs in France', 'https://en.wikipedia.org/wiki/Paris_Saint-Germain_F.C.');

-- Sample Players for FC Barcelona
INSERT INTO players (full_name, date_of_birth, nationality, position, jersey_number, height, weight, contract_start, contract_end, salary, player_value, team_id, photo_url, is_injured, injury_details, rating)
VALUES 
('Lionel Messi', '1987-06-24', 'Argentina', 'Forward', 10, 170.18, 72.50, '2021-07-01', '2025-06-30', 40000000.00, 100000000.00, 1, 'https://example.com/messi.png', 0, NULL, 10),
('Gerard Piqué', '1987-02-02', 'Spain', 'Defender', 3, 193.04, 85.00, '2019-01-01', '2024-06-30', 12000000.00, 35000000.00, 1, 'https://example.com/pique.png', 0, NULL, 8),
('Sergio Busquets', '1988-07-16', 'Spain', 'Midfielder', 5, 188.98, 76.00, '2020-01-01', '2024-06-30', 10000000.00, 30000000.00, 1, 'https://example.com/busquets.png', 1, 'Ankle sprain, expected return in 2 weeks', 8),
('Jordi Alba', '1989-03-21', 'Spain', 'Defender', 18, 170.18, 68.00, '2020-01-01', '2024-06-30', 8000000.00, 25000000.00, 1, 'https://example.com/alba.png', 0, NULL, 7);

-- Sample Players for Manchester United
INSERT INTO players (full_name, date_of_birth, nationality, position, jersey_number, height, weight, contract_start, contract_end, salary, player_value, team_id, photo_url, is_injured, injury_details, rating)
VALUES 
('Bruno Fernandes', '1994-09-08', 'Portugal', 'Midfielder', 8, 178.00, 75.00, '2021-01-01', '2026-06-30', 10500000.00, 90000000.00, 2, 'https://example.com/bruno.png', 0, NULL, 9),
('Marcus Rashford', '1997-10-31', 'England', 'Forward', 10, 185.00, 70.00, '2019-07-01', '2024-06-30', 9500000.00, 85000000.00, 2, 'https://example.com/rashford.png', 0, NULL, 8),
('Harry Maguire', '1993-03-05', 'England', 'Defender', 5, 194.00, 90.00, '2020-01-01', '2025-06-30', 9000000.00, 55000000.00, 2, 'https://example.com/maguire.png', 1, 'Hamstring injury, out for 3 weeks', 7),
('David de Gea', '1990-11-07', 'Spain', 'Goalkeeper', 1, 192.00, 82.00, '2021-07-01', '2025-06-30', 12000000.00, 45000000.00, 2, 'https://example.com/degea.png', 0, NULL, 8);

-- Sample Players for Bayern Munich
INSERT INTO players (full_name, date_of_birth, nationality, position, jersey_number, height, weight, contract_start, contract_end, salary, player_value, team_id, photo_url, is_injured, injury_details, rating)
VALUES 
('Robert Lewandowski', '1988-08-21', 'Poland', 'Forward', 9, 184.00, 80.00, '2020-07-01', '2025-06-30', 18000000.00, 85000000.00, 3, 'https://example.com/lewandowski.png', 0, NULL, 9),
('Manuel Neuer', '1986-03-27', 'Germany', 'Goalkeeper', 1, 193.00, 92.00, '2020-01-01', '2024-06-30', 15000000.00, 40000000.00, 3, 'https://example.com/neuer.png', 0, NULL, 9),
('Joshua Kimmich', '1995-02-08', 'Germany', 'Midfielder', 6, 176.00, 73.00, '2021-07-01', '2026-06-30', 12000000.00, 80000000.00, 3, 'https://example.com/kimmich.png', 0, NULL, 8),
('Thomas Müller', '1989-09-13', 'Germany', 'Forward', 25, 186.00, 76.00, '2019-07-01', '2023-06-30', 10000000.00, 35000000.00, 3, 'https://example.com/muller.png', 1, 'Minor knee injury, day-to-day decision', 8);

-- Sample Players for Juventus
INSERT INTO players (full_name, date_of_birth, nationality, position, jersey_number, height, weight, contract_start, contract_end, salary, player_value, team_id, photo_url, is_injured, injury_details, rating)
VALUES 
('Cristiano Ronaldo', '1985-02-05', 'Portugal', 'Forward', 7, 187.00, 85.00, '2021-07-01', '2023-06-30', 31000000.00, 50000000.00, 4, 'https://example.com/ronaldo.png', 0, NULL, 9),
('Paulo Dybala', '1993-11-15', 'Argentina', 'Forward', 10, 177.00, 75.00, '2020-07-01', '2024-06-30', 13500000.00, 75000000.00, 4, 'https://example.com/dybala.png', 0, NULL, 8),
('Giorgio Chiellini', '1984-08-14', 'Italy', 'Defender', 3, 187.00, 85.00, '2020-01-01', '2023-06-30', 7500000.00, 15000000.00, 4, 'https://example.com/chiellini.png', 0, NULL, 7),
('Wojciech Szczęsny', '1990-04-18', 'Poland', 'Goalkeeper', 1, 195.00, 90.00, '2019-07-01', '2024-06-30', 8500000.00, 35000000.00, 4, 'https://example.com/szczesny.png', 0, NULL, 8);

-- Sample Players for Paris Saint-Germain
INSERT INTO players (full_name, date_of_birth, nationality, position, jersey_number, height, weight, contract_start, contract_end, salary, player_value, team_id, photo_url, is_injured, injury_details, rating)
VALUES 
('Kylian Mbappé', '1998-12-20', 'France', 'Forward', 7, 178.00, 73.00, '2021-07-01', '2025-06-30', 25000000.00, 180000000.00, 5, 'https://example.com/mbappe.png', 0, NULL, 9),
('Neymar Jr', '1992-02-05', 'Brazil', 'Forward', 10, 175.00, 68.00, '2021-07-01', '2025-06-30', 36000000.00, 110000000.00, 5, 'https://example.com/neymar.png', 1, 'Groin strain, expected return next match', 9),
('Marco Verratti', '1992-11-05', 'Italy', 'Midfielder', 6, 165.00, 60.00, '2020-07-01', '2024-06-30', 14000000.00, 65000000.00, 5, 'https://example.com/verratti.png', 0, NULL, 8),
('Keylor Navas', '1986-12-15', 'Costa Rica', 'Goalkeeper', 1, 185.00, 80.00, '2019-09-02', '2023-06-30', 10000000.00, 15000000.00, 5, 'https://example.com/navas.png', 0, NULL, 8);
