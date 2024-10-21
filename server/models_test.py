import pytest
from config import app, db
from models import User, Tournament, Registration
from datetime import datetime

# Use pytest's fixture to create a test app and database
@pytest.fixture(scope='module')
def test_client():
    # Create a temporary app context
    with app.app_context():
        db.create_all()  # Create tables for testing
        yield app.test_client()  # Provide a test client to interact with the app
        db.session.remove()
        db.drop_all()  # Clean up after tests

def test_create_user(test_client):
    # Create a user
    user = User(username="player1", email="player1@example.com")
    db.session.add(user)
    db.session.commit()

    # Query the user and verify
    queried_user = User.query.first()
    assert queried_user.username == "player1"
    assert queried_user.email == "player1@example.com"

def test_create_tournament(test_client):
    # Create a tournament
    tournament = Tournament(
        title="Mario Kart Tournament",
        game="Mario Kart 8",
        description="A fun racing competition!",
        date=datetime(2024, 10, 20, 10, 0),
        location="New York"
    )
    db.session.add(tournament)
    db.session.commit()

    # Query the tournament and verify
    queried_tournament = Tournament.query.first()
    assert queried_tournament.title == "Mario Kart Tournament"
    assert queried_tournament.game == "Mario Kart 8"
    assert queried_tournament.location == "New York"

def test_registration_relationships(test_client):
    # Get the user and tournament from the database
    user = User.query.first()
    tournament = Tournament.query.first()

    # Register the user for the tournament
    registration = Registration(user=user, tournament=tournament, team_name="Speed Demons")
    db.session.add(registration)
    db.session.commit()

    # Verify the registration was created
    queried_registration = Registration.query.first()
    assert queried_registration.team_name == "Speed Demons"
    assert queried_registration.user_id == user.id
    assert queried_registration.tournament_id == tournament.id

    # Verify the relationships
    assert user.tournaments[0].title == "Mario Kart Tournament"
    assert tournament.registrations[0].user.username == "player1"
