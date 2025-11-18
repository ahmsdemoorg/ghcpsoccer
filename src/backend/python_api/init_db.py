#!/usr/bin/env python
"""
Script to initialize the SQLite database for the Python backend.
This script will create the database schema and populate it with sample data.
"""

import os
import sqlite3
import sys

# Get the absolute path to the necessary directories
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
schemas_dir = os.path.join(project_root, "schemas")
db_path = os.path.join(current_dir, "instance", "soccer_app.db")

# Ensure the instance directory exists
os.makedirs(os.path.join(current_dir, "instance"), exist_ok=True)

# Check if database file already exists and delete it if it does
if os.path.exists(db_path):
    print(f"Removing existing database at {db_path}")
    os.remove(db_path)

# Read the schema and sample data SQL files
schema_path = os.path.join(schemas_dir, "schema.sql")
sample_data_path = os.path.join(schemas_dir, "sample_data.sql")

print(f"Using schema file: {schema_path}")
print(f"Using sample data file: {sample_data_path}")

with open(schema_path, 'r') as f:
    schema_sql = f.read()

with open(sample_data_path, 'r') as f:
    sample_data_sql = f.read()

# Connect to the database and execute the scripts
print(f"Creating and initializing database at {db_path}")
conn = sqlite3.connect(db_path)
conn.executescript(schema_sql)
conn.executescript(sample_data_sql)
conn.commit()
conn.close()

print("Database initialized successfully with schema and sample data!")
print("Run the application with 'python app.py'")
