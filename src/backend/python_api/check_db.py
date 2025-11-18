#!/usr/bin/env python
"""
Script to directly check the database content
"""

import os
import sqlite3

# Get the absolute path to the database file
current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, "instance", "soccer_app.db")

print(f"Checking database at: {db_path}")

# Connect to the database
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row  # This enables column access by name

# Check teams table
print("\n=== Teams Table ===")
cursor = conn.execute("SELECT * FROM teams")
teams = cursor.fetchall()
print(f"Number of teams: {len(teams)}")
if teams:
    for team in teams:
        print(f"Team {team['id']}: {team['name']} ({team['country']})")

# Check players table
print("\n=== Players Table ===")
cursor = conn.execute("SELECT * FROM players")
players = cursor.fetchall()
print(f"Number of players: {len(players)}")
if players:
    for player in players:
        print(f"Player {player['id']}: {player['full_name']} (Team ID: {player['team_id']})")

conn.close()
print("\nDatabase check complete.")
