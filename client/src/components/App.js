import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Importing the Home component
import TournamentDetails from './TournamentDetails'; // Placeholder for tournament details component
import RegistrationForm from './RegistrationForm'; // Importing the registration form component
import Navbar from './Navbar'; // Importing the Navbar component

const App = () => {
  return (
    <Router>
      <Navbar />  {/* Added the Navbar with Tabs */}
      <div className="flex min-h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-4 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-green-400">Tournament</h2>
          <div className="space-y-4">
            <button className="bg-gray-700 p-4 w-full rounded-lg hover:bg-green-400 hover:text-black">
              Create Tournament
            </button>
            <div className="space-y-4">
              <h3 className="font-bold text-gray-400">Coming Up</h3>
              <button className="bg-gray-700 p-3 w-full rounded-lg hover:bg-green-400 hover:text-black">
                Tournament 1
              </button>
              <button className="bg-gray-700 p-3 w-full rounded-lg hover:bg-green-400 hover:text-black">
                Tournament 2
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tournaments" element={<TournamentDetails />} />
            <Route path="/register" element={<RegistrationForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
