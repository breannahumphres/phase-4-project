from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime, timezone
from config import db


# Models go here!

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key= True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    registrations = db.relationship("Registration", back_populates = "user", cascade="all, delete-orphan")
    tournaments = association_proxy("registrations", "tournament")
    serialize_rules = ("registrations", "-registrations.user")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "registrations": [reg.to_dict() for reg in self.registrations]
        }

    def __repr__(self):
        return f'<User {self.id}, {self.username}, {self.email}>'

class Tournament(db.Model, SerializerMixin):
    __tablename__ = "tournaments"

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String, nullable=False)
    game = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    date = db.Column(db.DateTime, nullable = True, default=lambda: datetime.now(timezone.utc))
    location = db.Column(db.String)
    registrations = db.relationship("Registration", back_populates = "tournament", cascade="all, delete-orphan")
    serialize_rules = ("registrations", "-registrations.tournament")

    def formatted_date(self):
        if self.date:
            return self.date.strftime('%Y-%m-%d %H:%M:%S')
        return "Date not set"

    def to_dict(self, include_registrations=False):
        data = {
            "id": self.id,
            "title": self.title,
            "game": self.game,
            "description": self.description,
            "date": self.formatted_date(),
            "location": self.location,
        }
        if include_registrations:
            data["registrations"] = [reg.to_dict() for reg in self.registrations]
        return data

    def __repr__(self):
        return f'<Tournament {self.id}, {self.title}, {self.game}, {self.description}, {self.date}>'

class Registration(db.Model, SerializerMixin):
    __tablename__ = "registrations"

    id = db.Column(db.Integer, primary_key= True)
    user_id= db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)
    tournament_id = db.Column(db.Integer, db.ForeignKey('tournaments.id'), nullable=False)
    team_name = db.Column(db.String, nullable=False, default = "Unnamed Team")

    user = db.relationship("User", back_populates = "registrations")
    tournament = db.relationship("Tournament", back_populates = "registrations")

    serialize_rules = ("user", "-user.registrations", "tournament", "-tournament.registrations")


    def to_dict(self):
        return {
            "id": self.id,
            "team_name": self.team_name,
            "user": {
                "id": self.user.id,
                "username": self.user.username,
                "email": self.user.email
            },
            "tournament": {
                "id": self.tournament.id,
                "title": self.tournament.title,
                "game": self.tournament.game,
                "location": self.tournament.location,
                "date": self.tournament.formatted_date()
            }
        }

    def __repr__(self):
        return f'<Registration {self.id}, User {self.user_id}, Tournament {self.tournament_id}, Team {self.team_name}>'
