import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { format } from 'date-fns'; // Importing date-fns for formatting dates

const TournamentDetails = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null); // For the details popup

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/tournaments`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch tournaments');
        }
        return response.json();
      })
      .then(data => {
        setTournaments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        toast.error('Error fetching tournaments');
      });
  }, []);

  // Show tournament details in a popup
  const handleShowDetails = (tournament) => {
    setSelectedTournament(tournament);
  };

  // Close the details popup
  const handleCloseDetails = () => {
    setSelectedTournament(null);
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><ClipLoader color="#36d7b7" size={150} /></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (tournaments.length === 0) return <div>No tournaments found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-4xl font-bold text-green-400 mb-6">All Tournaments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-2">{tournament.title}</h2>
            <p className="text-gray-400 mb-2">Date: {format(new Date(tournament.date), 'MM/dd/yyyy')}</p> {/* Formatting date */}
            <p className="text-gray-400 mb-2">Location: {tournament.location}</p>
            <p className="text-gray-400 mb-2">Game: {tournament.game}</p>
            <p className="text-yellow-400 mb-4">Tournament ID: {tournament.id}</p> {/* Displaying tournament ID */}

            {/* Details Button */}
            <button
              onClick={() => handleShowDetails(tournament)}
              className="bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500"
            >
              Details
            </button>
          </div>
        ))}
      </div>

      {/* Details Popup */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg text-white w-1/3">
            <h2 className="text-2xl font-bold mb-4">{selectedTournament.title}</h2>
            <p className="mb-4">{selectedTournament.description || 'No description available.'}</p>
            <button
              className="bg-red-400 text-black px-4 py-2 rounded-lg hover:bg-red-500"
              onClick={handleCloseDetails}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentDetails;
