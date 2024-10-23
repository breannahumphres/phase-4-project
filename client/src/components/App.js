import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importing toastify styles
import Navbar from './Navbar';
import ClipLoader from 'react-spinners/ClipLoader';

const Home = lazy(() => import('./Home')); // Lazy loading components
const TournamentDetails = lazy(() => import('./TournamentDetails'));
const RegistrationForm = lazy(() => import('./RegistrationForm'));
const CreateTournamentForm = lazy(() => import('./CreateTournamentForm'));
const MyRegistrations = lazy(() => import('./MyRegistrations')); // Import MyRegistrations component

const App = () => {
  const [joinedTournaments, setJoinedTournaments] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const addJoinedTournament = (tournament) => {
    setJoinedTournaments((prev) => [...prev, tournament]);
  };

  // Fetch and sort tournaments by date
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/tournaments`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch tournaments');
        return response.json();
      })
      .then(data => {
        // Sort tournaments by date (ascending order)
        const sortedTournaments = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setTournaments(sortedTournaments);
        setLoading(false);
      })
      .catch(() => {
        console.error('Error fetching tournaments');
        setLoading(false);
      });
  }, []);

  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="flex min-h-screen bg-gray-900 text-white">

        {/* Sidebar */}
        <aside className="sidebar w-64 p-4 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-green-400">Tournament</h2>

          <div className="space-y-4">
            <Link to="/create-tournament">
              <button className="tournament-button w-full">Create Tournament</button>
            </Link>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-400">Coming Up</h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                tournaments.map(tournament => (
                  <div key={tournament.id} className="tournament-button w-full">
                    {new Date(tournament.date).toLocaleDateString()} - {tournament.title}
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Suspense fallback={<ClipLoader color="#36d7b7" size={150} />}>
            <Routes>
              <Route
                path="/"
                element={<Home addJoinedTournament={addJoinedTournament} />}
              />
              <Route
                path="/tournaments"
                element={<TournamentDetails joinedTournaments={joinedTournaments} />}
              />
              <Route path="/register/" element={<RegistrationForm />} />
              <Route path="/create-tournament" element={<CreateTournamentForm />} />
              <Route path="/my-registrations" element={<MyRegistrations />} /> {/* Add MyRegistrations route */}
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
};

export default App;
