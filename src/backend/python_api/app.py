# Python API for Soccer Team Management
# This is a demo app to showcase GitHub Copilot features

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure SQLAlchemy with SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instance/soccer_app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
print(f"SQLAlchemy connecting to: {app.config['SQLALCHEMY_DATABASE_URI']}")
db = SQLAlchemy(app)

# Define models
class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    established_year = db.Column(db.Integer)
    home_stadium = db.Column(db.String(100))
    logo_url = db.Column(db.String(200))
    club_colors = db.Column(db.String(100))
    country = db.Column(db.String(100))
    league = db.Column(db.String(100))
    current_season_position = db.Column(db.Integer)
    team_value = db.Column(db.Float)
    historical_performance = db.Column(db.Text)
    contact_information = db.Column(db.String(200))
    description = db.Column(db.Text)
    wikipedia_link = db.Column(db.String(200))
    
    players = db.relationship('Player', backref='team', lazy=True, cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'established_year': self.established_year,
            'home_stadium': self.home_stadium,
            'logo_url': self.logo_url,
            'club_colors': self.club_colors,
            'country': self.country,
            'league': self.league,
            'current_season_position': self.current_season_position,
            'team_value': self.team_value,
            'historical_performance': self.historical_performance,
            'contact_information': self.contact_information,
            'description': self.description,
            'wikipedia_link': self.wikipedia_link
        }

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    date_of_birth = db.Column(db.Date)
    nationality = db.Column(db.String(100))
    position = db.Column(db.String(50))
    jersey_number = db.Column(db.Integer)
    height = db.Column(db.Float)
    weight = db.Column(db.Float)
    contract_start = db.Column(db.Date)
    contract_end = db.Column(db.Date)
    salary = db.Column(db.Float)
    player_value = db.Column(db.Float)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    photo_url = db.Column(db.String(200))
    is_injured = db.Column(db.Boolean, default=False)
    injury_details = db.Column(db.Text)
    rating = db.Column(db.Integer)  # 1-10 scale
    
    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'nationality': self.nationality,
            'position': self.position,
            'jersey_number': self.jersey_number,
            'height': self.height,
            'weight': self.weight,
            'contract_start': self.contract_start.isoformat() if self.contract_start else None,
            'contract_end': self.contract_end.isoformat() if self.contract_end else None,
            'salary': self.salary,
            'player_value': self.player_value,
            'team_id': self.team_id,
            'photo_url': self.photo_url,
            'is_injured': self.is_injured,
            'injury_details': self.injury_details,
            'rating': self.rating
        }

# Verify database is loaded with data
def load_data():
    try:
        # Check if the database has data
        teams_count = Team.query.count()
        players_count = Player.query.count()
        
        print(f"Database contains {teams_count} teams and {players_count} players")
        
        # If no data, suggest running the initialization script
        if teams_count == 0 or players_count == 0:
            print("No data found in the database. Please run the initialization script:")
            print("python init_db.py")
            
            # Try to get more information about database location
            db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "instance", "soccer_app.db")
            if os.path.exists(db_path):
                print(f"Database file exists at {db_path}, but appears to be empty or not properly initialized")
                db_size = os.path.getsize(db_path)
                print(f"Database file size: {db_size} bytes")
            else:
                print(f"Database file does not exist at {db_path}")
                
    except Exception as e:
        print(f"Error checking database: {e}")

# Team endpoints
@app.route('/api/teams', methods=['GET'])
def get_teams():
    # Optional query parameters for filtering
    country = request.args.get('country')
    league = request.args.get('league')
    
    # Print debug info
    print(f"Fetching teams with filters: country={country}, league={league}")
    
    # Use SQLAlchemy to query teams
    query = Team.query
    
    if country:
        query = query.filter(Team.country == country)
    if league:
        query = query.filter(Team.league == league)
    
    teams = query.all()
    print(f"SQLAlchemy found {len(teams)} teams")
    if len(teams) > 0:
        print(f"First team: {teams[0].name}")
    
    return jsonify([t.to_dict() for t in teams])

@app.route('/api/teams/<int:team_id>', methods=['GET'])
def get_team(team_id):
    print(f"Getting team with ID: {team_id} (type: {type(team_id)})")
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    return jsonify(team.to_dict())

@app.route('/api/teams', methods=['POST'])
def create_team():
    try:
        team_data = request.json
        print(f"Parsed JSON data: {team_data}")
        
        if not team_data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        if 'name' not in team_data:
            return jsonify({"error": "Team name is required"}), 400
            
        # Create the new team using SQLAlchemy
        new_team = Team(
            name=team_data.get('name'),
            established_year=team_data.get('established_year'),
            home_stadium=team_data.get('home_stadium'),
            logo_url=team_data.get('logo_url'),
            club_colors=team_data.get('club_colors'),
            country=team_data.get('country'),
            league=team_data.get('league'),
            current_season_position=team_data.get('current_season_position', 0),
            team_value=team_data.get('team_value', 0),
            historical_performance=team_data.get('historical_performance', ''),
            contact_information=team_data.get('contact_information', ''),
            description=team_data.get('description', ''),
            wikipedia_link=team_data.get('wikipedia_link', '')
        )
        
        db.session.add(new_team)
        db.session.commit()
        print(f"Team created successfully with ID: {new_team.id}")
        
        # Return the newly created team
        return jsonify(new_team.to_dict()), 201
            
    except Exception as e:
        print(f"Error creating team: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({"error": f"Failed to create team: {str(e)}"}), 500

@app.route('/api/teams/<int:team_id>', methods=['PUT'])
def update_team(team_id):
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    team_data = request.json
    
    for field in ['name','established_year','home_stadium','logo_url','club_colors','country','league','current_season_position','team_value','historical_performance','contact_information','description','wikipedia_link']:
        if field in team_data:
            setattr(team, field, team_data[field])
    
    db.session.commit()
    
    return jsonify(team.to_dict())

@app.route('/api/teams/<int:team_id>', methods=['DELETE'])
def delete_team(team_id):
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    db.session.delete(team)
    db.session.commit()
    
    return jsonify({'message': 'Team deleted successfully'})

# Player endpoints
@app.route('/api/players', methods=['GET'])
def get_players():
    # Optional query parameters for filtering
    team_id = request.args.get('team_id')
    position = request.args.get('position')
    injured = request.args.get('injured')
    
    # Use SQLAlchemy to query players
    query = Player.query
    
    if team_id:
        query = query.filter(Player.team_id == int(team_id))
    if position:
        query = query.filter(Player.position == position)
    if injured is not None:
        is_injured = injured.lower() == 'true'
        query = query.filter(Player.is_injured == is_injured)
    
    players = query.all()
    return jsonify([p.to_dict() for p in players])

@app.route('/api/players/<int:player_id>', methods=['GET'])
def get_player(player_id):
    player = Player.query.get(player_id)
    if player:
        return jsonify(player.to_dict())
    return jsonify({"error": "Player not found"}), 404

@app.route('/api/players', methods=['POST'])
def create_player():
    player_data = request.json
    
    # Convert date strings to date objects
    dob = datetime.fromisoformat(player_data.get('date_of_birth')) if player_data.get('date_of_birth') else None
    contract_start = datetime.fromisoformat(player_data.get('contract_start')) if player_data.get('contract_start') else None
    contract_end = datetime.fromisoformat(player_data.get('contract_end')) if player_data.get('contract_end') else None
    
    new_player = Player(
        full_name=player_data.get('full_name'),
        date_of_birth=dob,
        nationality=player_data.get('nationality'),
        position=player_data.get('position'),
        jersey_number=player_data.get('jersey_number'),
        height=player_data.get('height'),
        weight=player_data.get('weight'),
        contract_start=contract_start,
        contract_end=contract_end,
        salary=player_data.get('salary'),
        player_value=player_data.get('player_value'),
        team_id=player_data.get('team_id'),
        photo_url=player_data.get('photo_url'),
        is_injured=player_data.get('is_injured', False),
        injury_details=player_data.get('injury_details'),
        rating=player_data.get('rating')
    )
    
    db.session.add(new_player)
    db.session.commit()
    
    return jsonify(new_player.to_dict()), 201

@app.route('/api/players/<int:player_id>', methods=['PUT'])
def update_player(player_id):
    player = Player.query.get(player_id)
    if not player:
        return jsonify({"error": "Player not found"}), 404
    
    player_data = request.json
    
    # Convert date strings to date objects
    if player_data.get('date_of_birth'):
        player.date_of_birth = datetime.fromisoformat(player_data.get('date_of_birth'))
    if player_data.get('contract_start'):
        player.contract_start = datetime.fromisoformat(player_data.get('contract_start'))
    if player_data.get('contract_end'):
        player.contract_end = datetime.fromisoformat(player_data.get('contract_end'))
    
    player.full_name = player_data.get('full_name', player.full_name)
    player.nationality = player_data.get('nationality', player.nationality)
    player.position = player_data.get('position', player.position)
    player.jersey_number = player_data.get('jersey_number', player.jersey_number)
    player.height = player_data.get('height', player.height)
    player.weight = player_data.get('weight', player.weight)
    player.salary = player_data.get('salary', player.salary)
    player.player_value = player_data.get('player_value', player.player_value)
    player.team_id = player_data.get('team_id', player.team_id)
    player.photo_url = player_data.get('photo_url', player.photo_url)
    player.is_injured = player_data.get('is_injured', player.is_injured)
    player.injury_details = player_data.get('injury_details', player.injury_details)
    player.rating = player_data.get('rating', player.rating)
    
    db.session.commit()
    
    return jsonify(player.to_dict())

@app.route('/api/players/<int:player_id>', methods=['DELETE'])
def delete_player(player_id):
    player = Player.query.get(player_id)
    if not player:
        return jsonify({"error": "Player not found"}), 404
    
    db.session.delete(player)
    db.session.commit()
    
    return jsonify({"message": "Player deleted successfully"})

# Reporting endpoints
@app.route('/api/reports/team-composition', methods=['GET'])
def team_composition_report():
    team_id = request.args.get('team_id')
    if not team_id:
        return jsonify({'error': 'Team ID is required'}), 400
        
    try:
        team_id = int(team_id)
    except ValueError:
        return jsonify({'error': 'Invalid Team ID'}), 400
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    players = Player.query.filter(Player.team_id == team_id).all()
    
    # Create report data
    positions = {}
    nationalities = {}
    total_rating = 0
    total_value = 0
    injured_players = []
    
    for p in players:
        # Count positions
        position = p.position
        if position:
            if position not in positions:
                positions[position] = 0
            positions[position] += 1
        
        # Count nationalities
        nationality = p.nationality
        if nationality:
            if nationality not in nationalities:
                nationalities[nationality] = 0
            nationalities[nationality] += 1
        
        # Sum ratings and values
        total_rating += p.rating or 0
        total_value += p.player_value or 0
        
        # Track injured players
        if p.is_injured:
            injured_players.append(p.to_dict())
    
    avg_rating = total_rating / len(players) if players else 0
    
    report = {
        'team': team.to_dict(),
        'total_players': len(players),
        'positions': positions,
        'nationalities': nationalities,
        'average_rating': avg_rating,
        'total_value': total_value,
        'injured_players': injured_players
    }
    
    return jsonify(report)

@app.route('/api/reports/player-performance', methods=['GET'])
def player_performance_report():
    team_id = request.args.get('team_id')
    if not team_id:
        return jsonify({'error': 'Team ID is required'}), 400
    try:
        team_id = int(team_id)
    except ValueError:
        return jsonify({'error': 'Invalid Team ID'}), 400

    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404

    players = Player.query.filter(Player.team_id == team_id).all()
    if not players:
        return jsonify({'team': team.to_dict(), 'players': [], 'highest_rated': None, 'lowest_rated': None, 'average_rating': 0}), 200

    sorted_players = sorted(players, key=lambda p: (p.rating or 0), reverse=True)
    total_rating = sum([(p.rating or 0) for p in players])
    avg_rating = total_rating / len(players) if players else 0

    report = {
        'team': team.to_dict(),
        'players': [p.to_dict() for p in sorted_players],
        'highest_rated': sorted_players[0].to_dict(),
        'lowest_rated': sorted_players[-1].to_dict(),
        'average_rating': avg_rating
    }
    return jsonify(report)

@app.route('/api/reports/value-report', methods=['GET'])
def value_report():
    team_id = request.args.get('team_id')
    if not team_id:
        return jsonify({'error': 'Team ID is required'}), 400
    try:
        team_id = int(team_id)
    except ValueError:
        return jsonify({'error': 'Invalid Team ID'}), 400

    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404

    players = Player.query.filter(Player.team_id == team_id).all()
    if not players:
        return jsonify({'team': team.to_dict(), 'players': [], 'total_value': 0, 'most_valuable': None, 'least_valuable': None, 'average_value': 0}), 200

    sorted_players = sorted(players, key=lambda p: (p.player_value or 0), reverse=True)
    total_value = sum([(p.player_value or 0) for p in players])
    avg_value = total_value / len(players) if players else 0

    report = {
        'team': team.to_dict(),
        'players': [p.to_dict() for p in sorted_players],
        'total_value': total_value,
        'most_valuable': sorted_players[0].to_dict(),
        'least_valuable': sorted_players[-1].to_dict(),
        'average_value': avg_value
    }
    return jsonify(report)

@app.route('/api/reports/injury-report', methods=['GET'])
def injury_report():
    team_id = request.args.get('team_id')
    if not team_id:
        return jsonify({'error': 'Team ID is required'}), 400
    try:
        team_id = int(team_id)
    except ValueError:
        return jsonify({'error': 'Invalid Team ID'}), 400

    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404

    players = Player.query.filter(Player.team_id == team_id).all()
    injured_players = [p for p in players if p.is_injured]
    injury_rate = (len(injured_players) / len(players) * 100) if players else 0

    report = {
        'team': team.to_dict(),
        'total_players': len(players),
        'injured_players': [p.to_dict() for p in injured_players],
        'injury_rate': injury_rate
    }
    return jsonify(report)

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Ensure the instance directory exists
    os.makedirs('instance', exist_ok=True)
    
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()
        print("Database tables created or verified")
        
        # Load initial data
        load_data()
    
    # Start the server
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=True, port=5000)
