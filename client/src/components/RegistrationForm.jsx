import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const RegistrationForm = ({ tournamentId }) => {
  const [errorMessage, setErrorMessage] = useState('');

  // Validation schema for form fields
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(4, 'Username must be at least 4 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),  // Email field validation
    team_name: Yup.string().required('Team name is required'),
    tournament_id: Yup.number().required('Tournament ID is required'),
  });

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Step 1: Check if the user exists, if not create a new user
      const userResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/search?username=${values.username}`);

      let userId;

      if (userResponse.ok) {
        const userData = await userResponse.json();
        userId = userData[0]?.id; // If user exists, get the user ID
      } else {
        // Step 2: If the user doesn't exist, create a new user
        const newUserResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: values.username, email: values.email }), // Use the provided email
        });

        if (!newUserResponse.ok) throw new Error('Failed to create a new user');

        const newUserData = await newUserResponse.json();
        userId = newUserData.id; // Get the new user ID
      }

      // Step 3: Use the user_id in the registration request
      const registrationData = {
        user_id: userId,
        tournament_id: values.tournament_id,
        team_name: values.team_name,
      };

      // Step 4: Send the registration data to the API
      const registrationResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      if (registrationResponse.ok) {
        // Success notification
        toast.success('You have successfully registered for the tournament.');
        resetForm(); // Reset the form fields after successful submission
      } else {
        const errorResponse = await registrationResponse.json(); // Get detailed error message
        throw new Error(errorResponse.error || 'Registration failed');
      }
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(`Error registering: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Register for Tournament</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <Formik
        initialValues={{
          username: '',
          email: '',
          team_name: '',
          tournament_id: tournamentId || '', // Allow the user to enter tournament ID if it's not passed
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ resetForm }) => (
          <Form className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
            <div className="mb-4">
              <label htmlFor="username" className="block text-white">Username</label>
              <Field
                name="username"
                type="text"
                className="bg-gray-700 text-white p-2 rounded w-full"
              />
              <ErrorMessage name="username" component="div" className="text-red-400" />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-white">Email</label>
              <Field
                name="email"
                type="email"
                className="bg-gray-700 text-white p-2 rounded w-full"
              />
              <ErrorMessage name="email" component="div" className="text-red-400" />
            </div>

            <div className="mb-4">
              <label htmlFor="team_name" className="block text-white">Team Name</label>
              <Field
                name="team_name"
                type="text"
                className="bg-gray-700 text-white p-2 rounded w-full"
              />
              <ErrorMessage name="team_name" component="div" className="text-red-400" />
            </div>

            <div className="mb-4">
              <label htmlFor="tournament_id" className="block text-white">Tournament ID</label>
              <Field
                name="tournament_id"
                type="text"
                className="bg-gray-700 text-white p-2 rounded w-full"
              />
              <ErrorMessage name="tournament_id" component="div" className="text-red-400" />
            </div>

            <button type="submit" className="bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500">
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegistrationForm;
