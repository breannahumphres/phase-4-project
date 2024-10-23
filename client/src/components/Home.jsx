import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { format } from 'date-fns'; // Correctly importing format

const Home = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null); // For the details popup

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/tournaments`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch tournaments');
        return response.json();
      })
      .then(data => {
        setTournaments(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Error fetching tournaments');
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const adminPassword = window.prompt('Enter Admin Password:');

    if (!adminPassword) {
      toast.error('Password is required');
      return;
    }

    if (adminPassword !== 'supersecret') { // Change 'supersecret' to your backend admin password
      toast.error('Incorrect Password');
      return;
    }

    if (window.confirm('Are you sure you want to delete this tournament?')) {
      const optimisticTournaments = tournaments.filter(tournament => tournament.id !== id);
      setTournaments(optimisticTournaments); // Optimistically remove from UI
      setDeletingId(id);

      fetch(`${process.env.REACT_APP_API_BASE_URL}/tournaments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Password': adminPassword // Send the admin password in the header
        },
      }).then(response => {
        if (response.ok) {
          toast.success('Tournament deleted successfully');
        } else {
          throw new Error('Failed to delete tournament');
        }
        setDeletingId(null);
      }).catch(() => {
        // Restore the tournament list in case of failure
        setTournaments(tournaments);
        toast.error('Error deleting tournament');
        setDeletingId(null);
      });
    }
  };

  // Show tournament details in a popup
  const handleShowDetails = (tournament) => {
    setSelectedTournament(tournament);
  };

  // Close the details popup
  const handleCloseDetails = () => {
    setSelectedTournament(null);
  };

  // Render loading spinner while fetching tournaments
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#36d7b7" size={150} />
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      {/* Updated Banner Section with Matching Text Style */}
      <div className="relative bg-gray-800 text-white py-10 mb-10 rounded-lg shadow-xl">
        <div className="absolute inset-0 bg-opacity-50 bg-black"></div> {/* Subtle overlay for extra contrast */}
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-6">Compete, Connect, Conquer</h1>
          <p className="text-2xl mt-6 text-green-400">
            Welcome to <span className="text-white">GameVerse</span>!
          </p>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-green-400 mb-6 text-center">Available Tournaments</h1> {/* Centered heading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="tournament-card p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-2">{tournament.title}</h2>
            <p className="text-gray-400 mb-2">
              Date: {format(new Date(tournament.date), 'MM/dd/yyyy')}
            </p>
            <p className="text-gray-400 mb-2">Location: {tournament.location}</p>
            <p className="text-gray-400 mb-4">Game: {tournament.game}</p>
            <p className="text-yellow-400 mb-4">Tournament ID: {tournament.id}</p> {/* Display the tournament ID */}

            {/* Display registered teams and usernames */}
            <div className="text-white mb-4">
              <h3 className="font-bold">Registered Teams:</h3>
              {tournament.registrations && tournament.registrations.length > 0 ? (
                <ul>
                  {tournament.registrations.map((reg, index) => (
                    <li key={index} className="text-gray-300">
                      Team: {reg.team_name} - Player: {reg.user?.username || 'Unknown'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No teams registered yet.</p>
              )}
            </div>

            <div className="flex space-x-4">
              <Link to="/register" state={{ tournamentId: tournament.id, tournamentTitle: tournament.title }}>
                <button className="bg-blue-400 text-black px-4 py-2 rounded-lg hover:bg-blue-500">
                  Register
                </button>
              </Link>
              <button
                onClick={() => handleDelete(tournament.id)}
                className={`bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 ${
                  deletingId === tournament.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={deletingId === tournament.id}
              >
                {deletingId === tournament.id ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => handleShowDetails(tournament)}
                className="bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500"
              >
                Details
              </button>
            </div>
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

export default Home;
