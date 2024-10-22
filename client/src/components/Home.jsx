import React, { useEffect, useState } from 'react';

const Home = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/tournaments`)
      .then(response => response.json())
      .then(data => {
        setTournaments(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tournaments:', error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/tournaments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response.ok) {
          setTournaments(tournaments.filter(tournament => tournament.id !== id));
          alert('Tournament deleted successfully');
        } else {
          alert('Error deleting tournament');
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl text-green-400">Loading Tournaments...</h2>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-4xl font-bold text-green-400 mb-6">Available Tournaments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <img
              src={tournament.image || '/path/to/default-image.jpg'}
              alt={tournament.title || 'Tournament Image'}
              className="rounded-lg mb-4 w-full h-48 object-cover"
            />
            <h2 className="text-2xl font-bold text-white mb-2">{tournament.title}</h2>
            <p className="text-gray-400 mb-2">{tournament.date}</p>
            <p className="text-gray-400 mb-4">{tournament.location}</p>
            <div className="flex space-x-4">
              <button className="bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500">
                Join
              </button>
              <button
                onClick={() => handleDelete(tournament.id)}
                className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
