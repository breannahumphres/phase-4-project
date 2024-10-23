#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS
from datetime import datetime
# Local imports
from config import app, api, db
# Add your model imports
from models import User, Tournament, Registration

CORS(app)

ADMIN_PASSWORD = "supersecret"
def is_admin(request):
    password = request.headers.get("Admin-Password")
    return password == ADMIN_PASSWORD

# Views go here!

@app.route("/admin/tournaments/<int:id>", methods=["DELETE"])
def delete_tournaments(id):
    if not is_admin(request):
        return {"error": "Unauthorized"}, 403

    print(f"Received delete request for Tournament ID: {id}")  # Debugging log
    tournament = Tournament.query.get(id)
    if not tournament:
        return {"error": "Tournament not found"}, 404

    db.session.delete(tournament)
    db.session.commit()
    return {"message": f"Tournament with ID {id} deleted successfully"}, 200

@app.route("/registrations/<int:id>", methods=["DELETE"])
def delete_registration(id):
    registration = Registration.query.get(id)
    if not registration:
        return {"error": "registration not found"}, 404

    db.session.delete(registration)
    db.session.commit()
    return {"message": f"Registration with ID {id} deleted successfully"}, 200


@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class SearchUsers(Resource):
    def get(self):
        username = request.args.get('username')
        if not username:
            return make_response(jsonify({"error":"username is required"}), 400)
        user = User.query.filter_by(username=username).first()
        if not user:
            return make_response(jsonify({"error":"User not found"}), 404)

        registrations = Registration.query.filter_by(user_id=user.id).all()
        result = [
            {
                "id": reg.id,  # Include registration id
                "tournament": reg.tournament.title,
                "team_name": reg.team_name,
                "location": reg.tournament.location,
                "date": reg.tournament.formatted_date(),
                "username": user.username,  # Return the user's username
                "email": user.email  # Return the user's email
            }
            for reg in registrations
        ]
        return make_response(jsonify(result),200)

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users), 200)

    def post(self):
        data = request.get_json()

        if not data.get("username"):
            return make_response(jsonify({"error": "username is required"}), 400)
        if not data.get("email"):
            return make_response(jsonify({"error": "email is required"}), 400)

        if User.query.filter_by(email=data["email"]).first():
            return make_response(jsonify({"error": "email already exists"}),400)
        try:
            new_user = User(**data)
            db.session.add(new_user)
            db.session.commit()
            return make_response(jsonify(new_user.to_dict()),201)
        except IntegrityError:
            db.session.rollback()
            return make_response(jsonify({"error": "database integrity error"}), 400)

class UsersByID(Resource):
    def get(self, id):
        user = User.query.get(id)
        if not user:
            return {"error": "User not found"}, 404
        return user.to_dict(), 200

    def patch(self,id):
        user = User.query.get(id)
        if not user:
            return {"error": "user not found"}, 404
        data = request.get_json()
        if "username" in data:
            user.username = data["username"]
        if "email" in data:
            user.email = data["email"]
        db.session.commit()
        return user.to_dict(), 200

    def delete(self, id):
        if not is_admin(request):
            return {"error": "Unauthorized"}, 403

        user = User.query.get(id)
        if not user:
            return {"error": "user not found"}, 404

        db.session.delete(user)
        db.session.commit()
        return {"message": f"User with ID {id} deleted successfully"}, 200

class Tournaments(Resource):
    def get(self):
        tournaments = [tournament.to_dict(include_registrations=True) for tournament in Tournament.query.all()]
        return make_response(jsonify(tournaments), 200)

    def post(self):
        data = request.get_json()

        # Logging the received data for debugging
        print("Received data:", data)

        # Check if required fields are present
        required_fields = ["title", "game", "location"]
        for field in required_fields:
            if field not in data or not data[field]:
                return make_response(jsonify({"error": f"{field} is required"}), 400)

        # Convert date from string to datetime, if provided
        if "date" in data and data["date"]:
            try:
                data["date"] = datetime.strptime(data["date"], '%Y-%m-%d')  # Convert 'YYYY-MM-DD' to datetime
            except ValueError:
                return make_response(jsonify({"error": "Invalid date format, expected YYYY-MM-DD"}), 400)
        try:
            new_tournament = Tournament(**data)
            db.session.add(new_tournament)
            db.session.commit()
            return make_response(jsonify(new_tournament.to_dict()), 201)
        except IntegrityError:
            db.session.rollback()
            return make_response(jsonify({"error": "Database integrity error"}), 400)

class TournamentsByID(Resource):
    def get(self, id):
        tournament = Tournament.query.filter_by(id=id).first()
        if not tournament:
            return make_response({"error": "tournament not found"}, 404)
        return make_response(jsonify(tournament.to_dict(include_registrations=True)),200)

    def patch(self,id):
        tournament = Tournament.query.get(id)
        if not tournament:
            return {"error": "Tournament not found"}, 404
        data = request.get_json()
        if "title" in data:
            tournament.title = data["title"]
        if "game" in data:
            tournament.game = data["game"]
        if "location" in data:
            tournament.location = data["location"]

        db.session.commit()
        return tournament.to_dict(), 200

    def delete(self, id):
        print(f"Received delete request for Tournament ID: {id}")  # Debugging log
        tournament = Tournament.query.get(id)
        if not tournament:
            return {"error": "Tournament not found"}, 404

        db.session.delete(tournament)
        db.session.commit()
        return {"message": f"Tournament with ID {id} deleted successfully"}, 200

class Registrations(Resource):
    def get(self):
        registrations = [registration.to_dict() for registration in Registration.query.all()]
        return make_response(jsonify(registrations),200)

    def post(self):
        data = request.get_json()

        # Required fields validation
        required_fields = ["user_id", "tournament_id", "team_name"]
        for field in required_fields:
            if field not in data or not data[field]:
                return make_response(jsonify({"error": f"{field} is required"}), 400)

        user = User.query.get(data["user_id"])
        tournament = Tournament.query.get(data["tournament_id"])

        if not user:
            return make_response(jsonify({"error": "User not found"}), 404)
        if not tournament:
            return make_response(jsonify({"error": "Tournament not found"}), 404)

        # Check if the user is already registered
        existing_registration = Registration.query.filter_by(
            user_id=data["user_id"], tournament_id=data["tournament_id"]
        ).first()

        if existing_registration:
            return make_response(jsonify({"error": "User already registered for this tournament"}), 400)

        try:
            new_registration = Registration(**data)
            db.session.add(new_registration)
            db.session.commit()
            return make_response(jsonify(new_registration.to_dict()), 201)
        except IntegrityError:
            db.session.rollback()
            return make_response(jsonify({"error": "Database integrity error"}), 400)

class RegistrationsByID(Resource):
    def get(self, id):
        registration = Registration.query.filter_by(id=id).first()
        if not registration:
            return make_response({"error": "registration not found"}, 404)
        return make_response(jsonify(registration.to_dict(include_tournaments=True)), 200)

    def patch(self, id):
        registration = Registration.query.get(id)
        if not registration:
            return {"error": "registration not found"}, 404
        data = request.get_json()

        # Update fields
        if "team_name" in data:
            registration.team_name = data["team_name"]

        if "username" in data:
            registration.user.username = data["username"]

        if "email" in data:
            registration.user.email = data["email"]

        db.session.commit()
        return make_response(jsonify(registration.to_dict()), 200)


api.add_resource(Users, "/users")
api.add_resource(UsersByID,"/users/<int:id>")
api.add_resource(Tournaments, "/tournaments")
api.add_resource(TournamentsByID, "/tournaments/<int:id>")
api.add_resource(Registrations, "/registrations")
api.add_resource(RegistrationsByID, "/registrations/<int:id>")
api.add_resource(SearchUsers, "/api/search")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
