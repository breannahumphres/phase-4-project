import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TournamentDetails = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/tournaments/${id}`)  // Replace with Flask API endpoint
      .then(response => response.json())
      .then(data => setTournament(data));
  }, [id]);

  if (!tournament) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold text-green-400">{tournament.title}</h1>
      <p>Game: {tournament.game}</p>
      <p>Date: {tournament.date}</p>
      <p>Location: {tournament.location}</p>
      <p>Description: {tournament.description}</p>
      <h3 className="text-xl mt-6">Participants</h3>
      <ul className="list-disc list-inside">
        {tournament.registrations.map(reg => (
          <li key={reg.id}>{reg.team_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TournamentDetails;
