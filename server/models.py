from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime
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
    def __repr__(self):
        return f'<User {self.id}, {self.username}, {self.email}>'
    
class Tournament(db.Model, SerializerMixin):
    __tablename__ = "tournaments"

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String, nullable=False)
    game = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    date = db.Column(db.DateTime, nullable = True )
    location = db.Column(db.String)
    registrations = db.relationship("Registration", back_populates = "tournament", cascade="all, delete-orphan")
    serialize_rules = ("registrations", "-registrations.tournament")
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

    def __repr__(self):
        return f'<Registration {self.id}, User {self.user_id}, Tournament {self.tournament_id}, Team {self.team_name}>'
