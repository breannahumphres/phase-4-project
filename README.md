# GameVerse 🎮

**Compete, Connect, Conquer**

GameVerse is a platform where users can **create tournaments, register for events, and manage their gaming activities**. The project uses Flask for the backend with **SQLite** for data storage, and React for the frontend. This README covers all the essential files, routes, and how the frontend and backend work together.

### Table of Contents

1. How the Application Works
2. Files and What They Do
3. Routes Overview
4. Validations and Constraints
5. How the Frontend and Backend Work Together
6. Does the Project Meet All Requirements?
7. How to Run the Project

## How the Application Works

GameVerse allows users to create accounts, view tournaments, and register with team names for events. Admins can delete users, tournaments, and registrations with password-protected access. Users can:

  * Create tournaments with game details.
  * Join tournaments with their team name.
  * View their registrations and manage them via the frontend interface.

The project ensures smooth interaction between frontend and backend through **React Router** and **Flask RESTful API**.

## Files and What They Do

# Backend Files:
  * app.py:
    The main entry point, defining all API routes. It manages users, tournaments, and registrations, with admin routes protected by a password. Key functions include:

      * CRUD operations for Users, Tournaments, and Registrations.
      * Search Route to find users by username.
      * Admin Delete Routes for secure deletion.

  * models.py:
    Defines the models:

     * User: Contains username and email.
     * Tournament: Stores tournament details, including title, game, and location.
     * Registration: A join table linking users and tournaments, with a team_name field.

  * config.py:
    Configures the Flask app, database, and migrations.

# Frontend Files:

  * App.js:
    Sets up React Router and handles fetching data from the backend. It controls the state for tournaments and registrations.

  * Navbar.jsx:
    Displays the navigation links for easy routing between different pages.

  * Home.jsx:
    Displays a list of tournaments. Users can join tournaments from here.

  * CreateTournamentForm.jsx:
    A form to create a new tournament with game and location details.

  * MyRegistrations.jsx:
    Shows all the tournaments a user has registered for.

  * TournamentDetails.jsx:
    Displays detailed information about a specific tournament.

## Routes Overview

# User Routes

  * GET /users: List all users.
  * POST /users: Create a new user.
  * GET /users/<id>: Retrieve user details by ID.
  * PATCH /users/<id>: Update user details.
  * DELETE /admin/users/<id>: Admin route to delete a user.

# Tournament Routes
  * GET /tournaments: List all tournaments.
  * POST /tournaments: Create a new tournament.
  * GET /tournaments/<id>: View tournament details.
  * PATCH /tournaments/<id>: Update tournament details.
  * DELETE /admin/tournaments/<id>: Admin route to delete a tournament.

# Registration Routes
  * GET /registrations: List all registrations.
  * POST /registrations: Register a user for a tournament.
  * GET /registrations/<id>: View registration details.
  * PATCH /registrations/<id>: Update registration details.
  * DELETE /admin/registrations/<id>: Admin route to delete a registration.

# Search Route
  * GET /api/search?username=<username>: Search for a user and view their registrations.

## Validations and Constraints

# Backend Validation:

  * Users:
    * username and email are required.
    * email must be unique.

  * Tournaments:
    * title, game, and location are required.

  * Registrations:
    * Team names are user-submitted fields.
    * Duplicate registrations (same user and tournament) are prevented.

# Frontend Validation:
  * Forms ensure required fields are filled before submission, such as during tournament creation or registration.

## How the Frontend and Backend Work Together

1. Fetching Data:
  * The frontend uses GET requests to fetch users, tournaments, and registrations from the backend.

2. Creating and Updating Data:  
  * POST and PATCH requests allow users to add or modify tournaments, registrations, and user details.

3. Admin Features:
  * Admins can securely delete users, tournaments, or registrations by providing a password in the request headers.

4. State Management:
  * The frontend tracks state, ensuring changes like new registrations are reflected immediately in the UI.

## How to Run the Project
1. Clone the Repository:
git clone https://github.com/your-username/gameverse.git
cd gameverse

2. Create and Activate the Virtual Environment:
pipenv install
pipenv shell

3. Set up the Database:
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

4. Run the Server:
python app.py

5. Access the Frontend:
  * Run the frontend by navigating to the appropriate directory and using:
npm start

## Conclusion
GameVerse is a complete platform for managing gaming tournaments, registrations, and users. The backend and frontend are fully integrated, with smooth communication through fetch requests. Validation ensures data integrity, and admin features allow secure management of resources. 

__GameVerse was created by Kevin Villeda and Bre Humphres.__