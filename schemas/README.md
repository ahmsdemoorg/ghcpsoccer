# Soccer App Database Schema

This directory contains SQL scripts for creating and populating the database used by the Soccer App.

## Files

- `schema.sql` - Creates the tables and indexes needed for the application
- `sample_data.sql` - Populates the database with sample teams and players
- `init_database.sql` - Combines both scripts for easy database initialization

## How to Use

### With SQLite Command Line

1. Navigate to this directory
2. Run the following command to initialize the database:

```bash
sqlite3 soccer_app.db < init_database.sql
```

### With Python Backend

The Python backend uses SQLAlchemy which will create the tables automatically based on the defined models.
However, you can still use these scripts to populate the database with sample data:

```bash
cd src/backend/python_api
sqlite3 soccer_app.db < ../../../schemas/sample_data.sql
```

### With C# Backend

The C# backend uses Entity Framework Core which will create the tables automatically.
You can use these scripts to populate the database with sample data:

```bash
cd src/backend/csharp_api
sqlite3 soccerapp.db < ../../../schemas/sample_data.sql
```

## Schema Overview

### Teams Table

Stores information about soccer teams including name, country, league, etc.

### Players Table

Stores information about players including name, position, team affiliation, etc.

## Relationships

- Each player belongs to one team (many-to-one relationship)
- Each team can have multiple players (one-to-many relationship)
