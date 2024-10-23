import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns'; // Import date-fns for formatting the date

const MyRegistrations = () => {
  const [username, setUsername] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null); // Holds the registration being edited
  const [editDetails, setEditDetails] = useState({ username: '', email: '', team_name: '' });

  // Fetch registered tournaments based on username
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/search?username=${username}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const data = await response.json();
      console.log("Received registrations:", data);
      setRegistrations(data);

      // Populate edit details with the first registration's user details (assuming same user)
      if (data.length > 0) {
        setEditDetails({
          username: data[0].username || 'Unknown',
          email: data[0].email || 'Unknown',
          team_name: data[0].team_name || 'Unnamed Team'
        });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle unregister action
  const handleUnregister = async (id) => {
    if (window.confirm('Are you sure you want to unregister from this tournament?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/registrations/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to unregister');
        }
        setRegistrations(registrations.filter(reg => reg.id !== id));
        toast.success('Successfully unregistered');
      } catch (error) {
        toast.error('Error unregistering');
      }
    }
  };

  // Open edit form for a specific registration
  const handleEdit = (registration) => {
    setEditingRegistration(registration);
    setEditDetails({
      username: registration.username || 'Unknown',
      email: registration.email || 'Unknown',
      team_name: registration.team_name || 'Unnamed Team'
    });
  };

  // Handle form submission for editing
  const handleEditSubmit = async () => {
    try {
      // Update user details
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/registrations/${editingRegistration.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDetails), // Send updated details
      });
      if (!response.ok) {
        throw new Error('Failed to update details');
      }

      // Update registration details locally after success
      const updatedRegistrations = registrations.map(reg =>
        reg.id === editingRegistration.id ? { ...reg, ...editDetails } : reg
      );
      setRegistrations(updatedRegistrations);
      setEditingRegistration(null); // Close the edit form
      toast.success('Details updated successfully');
    } catch (error) {
      toast.error('Error updating details');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Your Registered Tournaments</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-full"
        />
        <button onClick={handleSearch} className="mt-4 bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500">
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        registrations.map((registration) => (
          <div key={registration.id} className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">{registration.tournament || 'Tournament Name Unavailable'}</h2>
            <p className="text-gray-400 mb-2">Team Name: {registration.team_name || 'Unnamed Team'}</p>
            <p className="text-gray-400 mb-2">Location: {registration.location || 'Location Unavailable'}</p>
            <p className="text-gray-400 mb-2">
              Date: {registration.date ? format(new Date(registration.date), 'MM/dd/yyyy') : 'Date not available'}
            </p>
            <p className="text-gray-400 mb-2">Username: {registration.username || 'Unknown'}</p> {/* Show the username */}
            <p className="text-gray-400 mb-2">Email: {registration.email || 'Unknown'}</p> {/* Show the email */}

            <div className="flex space-x-4 mt-4 justify-center">
              <button
                className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500"
                onClick={() => handleUnregister(registration.id)}
              >
                Unregister
              </button>

              <button
                className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
                onClick={() => handleEdit(registration)}
              >
                Edit
              </button>
            </div>
          </div>
        ))
      )}

      {editingRegistration && (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg mt-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Edit Registration</h2>
          <div className="mb-4">
            <label className="block text-white">Username</label>
            <input
              type="text"
              value={editDetails.username}
              onChange={(e) => setEditDetails({ ...editDetails, username: e.target.value })}
              className="bg-gray-700 text-white p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Email</label>
            <input
              type="email"
              value={editDetails.email}
              onChange={(e) => setEditDetails({ ...editDetails, email: e.target.value })}
              className="bg-gray-700 text-white p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Team Name</label>
            <input
              type="text"
              value={editDetails.team_name}
              onChange={(e) => setEditDetails({ ...editDetails, team_name: e.target.value })}
              className="bg-gray-700 text-white p-2 rounded w-full"
            />
          </div>
          <button onClick={handleEditSubmit} className="bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
