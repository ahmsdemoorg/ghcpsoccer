"""Seed the SoccerApp Python API via REST calls using original sample_data.sql content.

Usage:
    1. Start the Flask API: python app.py
    2. Run this seeder: python seed_api_data.py

Idempotent: existing teams matched by name; players matched by (full_name, team_id).
"""
import requests
import datetime
import sys

BASE_URL = "http://localhost:5000/api"
SESSION = requests.Session()

TEAMS = [
    {
        "name": "FC Barcelona", "established_year": 1899, "home_stadium": "Camp Nou", "logo_url": "https://example.com/barcelona.png",
        "club_colors": "Blue and Red", "country": "Spain", "league": "La Liga", "current_season_position": 2,
        "team_value": 1250000000.00, "historical_performance": "Champions League winners: 5", "contact_information": "info@fcbarcelona.com",
        "description": "One of the most successful clubs in Spanish and European football", "wikipedia_link": "https://en.wikipedia.org/wiki/FC_Barcelona"
    },
    {
        "name": "Manchester United", "established_year": 1878, "home_stadium": "Old Trafford", "logo_url": "https://example.com/manutd.png",
        "club_colors": "Red and White", "country": "England", "league": "Premier League", "current_season_position": 4,
        "team_value": 1100000000.00, "historical_performance": "Premier League titles: 20", "contact_information": "info@manutd.com",
        "description": "English club based in Manchester, one of the most successful teams in English football", "wikipedia_link": "https://en.wikipedia.org/wiki/Manchester_United_F.C."
    },
    {
        "name": "Bayern Munich", "established_year": 1900, "home_stadium": "Allianz Arena", "logo_url": "https://example.com/bayern.png",
        "club_colors": "Red and Blue", "country": "Germany", "league": "Bundesliga", "current_season_position": 1,
        "team_value": 1050000000.00, "historical_performance": "Bundesliga champions: 31", "contact_information": "info@fcbayern.com",
        "description": "Most successful club in German football history", "wikipedia_link": "https://en.wikipedia.org/wiki/FC_Bayern_Munich"
    },
    {
        "name": "Juventus", "established_year": 1897, "home_stadium": "Juventus Stadium", "logo_url": "https://example.com/juventus.png",
        "club_colors": "Black and White", "country": "Italy", "league": "Serie A", "current_season_position": 3,
        "team_value": 950000000.00, "historical_performance": "Serie A titles: 36", "contact_information": "info@juventus.com",
        "description": "Most successful club in Italian football", "wikipedia_link": "https://en.wikipedia.org/wiki/Juventus_F.C."
    },
    {
        "name": "Paris Saint-Germain", "established_year": 1970, "home_stadium": "Parc des Princes", "logo_url": "https://example.com/psg.png",
        "club_colors": "Blue and Red", "country": "France", "league": "Ligue 1", "current_season_position": 1,
        "team_value": 900000000.00, "historical_performance": "Ligue 1 champions: 10", "contact_information": "info@psg.fr",
        "description": "One of the most prestigious clubs in France", "wikipedia_link": "https://en.wikipedia.org/wiki/Paris_Saint-Germain_F.C."
    },
]

PLAYERS = [
    # Barcelona (team index 0)
    {"full_name": "Lionel Messi", "date_of_birth": "1987-06-24", "nationality": "Argentina", "position": "Forward", "jersey_number": 10, "height": 170.18, "weight": 72.50, "contract_start": "2021-07-01", "contract_end": "2025-06-30", "salary": 40000000.00, "player_value": 100000000.00, "team_name": "FC Barcelona", "photo_url": "https://example.com/messi.png", "is_injured": False, "injury_details": None, "rating": 10},
    {"full_name": "Gerard Piqué", "date_of_birth": "1987-02-02", "nationality": "Spain", "position": "Defender", "jersey_number": 3, "height": 193.04, "weight": 85.00, "contract_start": "2019-01-01", "contract_end": "2024-06-30", "salary": 12000000.00, "player_value": 35000000.00, "team_name": "FC Barcelona", "photo_url": "https://example.com/pique.png", "is_injured": False, "injury_details": None, "rating": 8},
    {"full_name": "Sergio Busquets", "date_of_birth": "1988-07-16", "nationality": "Spain", "position": "Midfielder", "jersey_number": 5, "height": 188.98, "weight": 76.00, "contract_start": "2020-01-01", "contract_end": "2024-06-30", "salary": 10000000.00, "player_value": 30000000.00, "team_name": "FC Barcelona", "photo_url": "https://example.com/busquets.png", "is_injured": True, "injury_details": "Ankle sprain, expected return in 2 weeks", "rating": 8},
    {"full_name": "Jordi Alba", "date_of_birth": "1989-03-21", "nationality": "Spain", "position": "Defender", "jersey_number": 18, "height": 170.18, "weight": 68.00, "contract_start": "2020-01-01", "contract_end": "2024-06-30", "salary": 8000000.00, "player_value": 25000000.00, "team_name": "FC Barcelona", "photo_url": "https://example.com/alba.png", "is_injured": False, "injury_details": None, "rating": 7},
    # Manchester United
    {"full_name": "Bruno Fernandes", "date_of_birth": "1994-09-08", "nationality": "Portugal", "position": "Midfielder", "jersey_number": 8, "height": 178.00, "weight": 75.00, "contract_start": "2021-01-01", "contract_end": "2026-06-30", "salary": 10500000.00, "player_value": 90000000.00, "team_name": "Manchester United", "photo_url": "https://example.com/bruno.png", "is_injured": False, "injury_details": None, "rating": 9},
    {"full_name": "Marcus Rashford", "date_of_birth": "1997-10-31", "nationality": "England", "position": "Forward", "jersey_number": 10, "height": 185.00, "weight": 70.00, "contract_start": "2019-07-01", "contract_end": "2024-06-30", "salary": 9500000.00, "player_value": 85000000.00, "team_name": "Manchester United", "photo_url": "https://example.com/rashford.png", "is_injured": False, "injury_details": None, "rating": 8},
    {"full_name": "Harry Maguire", "date_of_birth": "1993-03-05", "nationality": "England", "position": "Defender", "jersey_number": 5, "height": 194.00, "weight": 90.00, "contract_start": "2020-01-01", "contract_end": "2025-06-30", "salary": 9000000.00, "player_value": 55000000.00, "team_name": "Manchester United", "photo_url": "https://example.com/maguire.png", "is_injured": True, "injury_details": "Hamstring injury, out for 3 weeks", "rating": 7},
    {"full_name": "David de Gea", "date_of_birth": "1990-11-07", "nationality": "Spain", "position": "Goalkeeper", "jersey_number": 1, "height": 192.00, "weight": 82.00, "contract_start": "2021-07-01", "contract_end": "2025-06-30", "salary": 12000000.00, "player_value": 45000000.00, "team_name": "Manchester United", "photo_url": "https://example.com/degea.png", "is_injured": False, "injury_details": None, "rating": 8},
    # Bayern Munich
    {"full_name": "Robert Lewandowski", "date_of_birth": "1988-08-21", "nationality": "Poland", "position": "Forward", "jersey_number": 9, "height": 184.00, "weight": 80.00, "contract_start": "2020-07-01", "contract_end": "2025-06-30", "salary": 18000000.00, "player_value": 85000000.00, "team_name": "Bayern Munich", "photo_url": "https://example.com/lewandowski.png", "is_injured": False, "injury_details": None, "rating": 9},
    {"full_name": "Manuel Neuer", "date_of_birth": "1986-03-27", "nationality": "Germany", "position": "Goalkeeper", "jersey_number": 1, "height": 193.00, "weight": 92.00, "contract_start": "2020-01-01", "contract_end": "2024-06-30", "salary": 15000000.00, "player_value": 40000000.00, "team_name": "Bayern Munich", "photo_url": "https://example.com/neuer.png", "is_injured": False, "injury_details": None, "rating": 9},
    {"full_name": "Joshua Kimmich", "date_of_birth": "1995-02-08", "nationality": "Germany", "position": "Midfielder", "jersey_number": 6, "height": 176.00, "weight": 73.00, "contract_start": "2021-07-01", "contract_end": "2026-06-30", "salary": 12000000.00, "player_value": 80000000.00, "team_name": "Bayern Munich", "photo_url": "https://example.com/kimmich.png", "is_injured": False, "injury_details": None, "rating": 8},
    {"full_name": "Thomas Müller", "date_of_birth": "1989-09-13", "nationality": "Germany", "position": "Forward", "jersey_number": 25, "height": 186.00, "weight": 76.00, "contract_start": "2019-07-01", "contract_end": "2023-06-30", "salary": 10000000.00, "player_value": 35000000.00, "team_name": "Bayern Munich", "photo_url": "https://example.com/muller.png", "is_injured": True, "injury_details": "Minor knee injury, day-to-day decision", "rating": 8},
    # Juventus
    {"full_name": "Cristiano Ronaldo", "date_of_birth": "1985-02-05", "nationality": "Portugal", "position": "Forward", "jersey_number": 7, "height": 187.00, "weight": 85.00, "contract_start": "2021-07-01", "contract_end": "2023-06-30", "salary": 31000000.00, "player_value": 50000000.00, "team_name": "Juventus", "photo_url": "https://example.com/ronaldo.png", "is_injured": False, "injury_details": None, "rating": 9},
    {"full_name": "Paulo Dybala", "date_of_birth": "1993-11-15", "nationality": "Argentina", "position": "Forward", "jersey_number": 10, "height": 177.00, "weight": 75.00, "contract_start": "2020-07-01", "contract_end": "2024-06-30", "salary": 13500000.00, "player_value": 75000000.00, "team_name": "Juventus", "photo_url": "https://example.com/dybala.png", "is_injured": False, "injury_details": None, "rating": 8},
    {"full_name": "Giorgio Chiellini", "date_of_birth": "1984-08-14", "nationality": "Italy", "position": "Defender", "jersey_number": 3, "height": 187.00, "weight": 85.00, "contract_start": "2020-01-01", "contract_end": "2023-06-30", "salary": 7500000.00, "player_value": 15000000.00, "team_name": "Juventus", "photo_url": "https://example.com/chiellini.png", "is_injured": False, "injury_details": None, "rating": 7},
    {"full_name": "Wojciech Szczęsny", "date_of_birth": "1990-04-18", "nationality": "Poland", "position": "Goalkeeper", "jersey_number": 1, "height": 195.00, "weight": 90.00, "contract_start": "2019-07-01", "contract_end": "2024-06-30", "salary": 8500000.00, "player_value": 35000000.00, "team_name": "Juventus", "photo_url": "https://example.com/szczesny.png", "is_injured": False, "injury_details": None, "rating": 8},
    # PSG
    {"full_name": "Kylian Mbappé", "date_of_birth": "1998-12-20", "nationality": "France", "position": "Forward", "jersey_number": 7, "height": 178.00, "weight": 73.00, "contract_start": "2021-07-01", "contract_end": "2025-06-30", "salary": 25000000.00, "player_value": 180000000.00, "team_name": "Paris Saint-Germain", "photo_url": "https://example.com/mbappe.png", "is_injured": False, "injury_details": None, "rating": 9},
    {"full_name": "Neymar Jr", "date_of_birth": "1992-02-05", "nationality": "Brazil", "position": "Forward", "jersey_number": 10, "height": 175.00, "weight": 68.00, "contract_start": "2021-07-01", "contract_end": "2025-06-30", "salary": 36000000.00, "player_value": 110000000.00, "team_name": "Paris Saint-Germain", "photo_url": "https://example.com/neymar.png", "is_injured": True, "injury_details": "Groin strain, expected return next match", "rating": 9},
    {"full_name": "Marco Verratti", "date_of_birth": "1992-11-05", "nationality": "Italy", "position": "Midfielder", "jersey_number": 6, "height": 165.00, "weight": 60.00, "contract_start": "2020-07-01", "contract_end": "2024-06-30", "salary": 14000000.00, "player_value": 65000000.00, "team_name": "Paris Saint-Germain", "photo_url": "https://example.com/verratti.png", "is_injured": False, "injury_details": None, "rating": 8},
    {"full_name": "Keylor Navas", "date_of_birth": "1986-12-15", "nationality": "Costa Rica", "position": "Goalkeeper", "jersey_number": 1, "height": 185.00, "weight": 80.00, "contract_start": "2019-09-02", "contract_end": "2023-06-30", "salary": 10000000.00, "player_value": 15000000.00, "team_name": "Paris Saint-Germain", "photo_url": "https://example.com/navas.png", "is_injured": False, "injury_details": None, "rating": 8},
]


def get_existing_teams():
    resp = SESSION.get(f"{BASE_URL}/teams")
    resp.raise_for_status()
    return {t['name']: t for t in resp.json()}


def get_existing_players():
    resp = SESSION.get(f"{BASE_URL}/players")
    resp.raise_for_status()
    players = resp.json()
    # index by (full_name, team_id)
    index = {}
    for p in players:
        index[(p['full_name'], p['team_id'])] = p
    return index


def create_team_if_missing(team):
    existing = get_existing_teams()
    if team['name'] in existing:
        print(f"Team exists: {team['name']}")
        return existing[team['name']]['id']
    r = SESSION.post(f"{BASE_URL}/teams", json=team)
    if r.status_code not in (200,201):
        print(f"Failed to create team {team['name']}: {r.status_code} {r.text}")
        return None
    data = r.json()
    print(f"Created team {data['name']} (id={data['id']})")
    return data['id']


def create_player_if_missing(player, team_id):
    existing_players = get_existing_players()
    key = (player['full_name'], team_id)
    if key in existing_players:
        print(f"Player exists: {player['full_name']} (team_id={team_id})")
        return existing_players[key]['id']
    payload = player.copy()
    payload['team_id'] = team_id
    r = SESSION.post(f"{BASE_URL}/players", json=payload)
    if r.status_code not in (200,201):
        print(f"Failed to create player {player['full_name']}: {r.status_code} {r.text}")
        return None
    data = r.json()
    print(f"Created player {data['full_name']} (id={data['id']})")
    return data['id']


def main():
    try:
        existing = get_existing_teams()
    except Exception as e:
        print("API not reachable. Start the Flask server first (python app.py).")
        print(e)
        sys.exit(1)

    name_to_id = {}
    # Create teams
    for t in TEAMS:
        tid = create_team_if_missing(t)
        if tid:
            name_to_id[t['name']] = tid

    # Create players
    for p in PLAYERS:
        team_name = p['team_name']
        team_id = name_to_id.get(team_name)
        if not team_id:
            print(f"Skipping player {p['full_name']} - team missing: {team_name}")
            continue
        create_player_if_missing(p, team_id)

    print("Seeding complete.")

if __name__ == '__main__':
    main()
