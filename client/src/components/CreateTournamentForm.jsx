import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const CreateTournamentForm = () => {
  const [errorMessage, setErrorMessage] = useState('');

  // Validation schema for form fields
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    game: Yup.string().required('Game is required'),
    date: Yup.date().required('Tournament date is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string(),
  });

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const tournamentData = {
        ...values, // Send the form data including title, game, date, location, and description
      };

      // Sending the tournament data to the API
      const tournamentResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tournamentData),
      });

      if (tournamentResponse.ok) {
        toast.success('Tournament created successfully!');
        resetForm(); // Reset the form fields after successful submission
      } else {
        throw new Error('Failed to create tournament');
      }
    } catch (error) {
      setErrorMessage(error.message);
      toast.error('Error creating tournament');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Create a New Tournament</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <Formik
        initialValues={{
          title: '',
          game: '',
          date: '',
          location: '',
          description: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ resetForm }) => (
          <Form className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
            <div className="mb-4">
              <label htmlFor="title" className="block text-white">Title</label>
              <Field
                name="title"
                type="text"
                className="bg-gray-700 text-white p-2 rounded w-full"
              />
              <ErrorMessage name="title" component="div" className="text-red-400" />
            </div>

            <div className="mb-4">
              <label htmlFor="game" className="block text-white">Game</label>
              <Field
                name="game"
                type="text"
                className="bg-gray-700 text-white p-2 rounded w-full"
              />
              <ErrorMessage name="game" component="div" className="text-red-400" />
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block text-white">Date</label>
              <Field
                name="date"
                type="date"
                className="bg-gray-700 text-white p-2 rounded w-full"
              />
              <ErrorMessage name="date" component="div" className="text-red-400" />
            </div>

            <div className="mb-4">
              <label htmlFor="location" className="block text-white">Location</label>
              <Field
                name="location"
                type="text"
                className="bg-gray-700 text-white p-2 rounded w-full"
              />
              <ErrorMessage name="location" component="div" className="text-red-400" />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-white">Description</label>
              <Field
                name="description"
                as="textarea"
                className="bg-gray-700 text-white p-2 rounded w-full"
              />
              <ErrorMessage name="description" component="div" className="text-red-400" />
            </div>

            <button type="submit" className="bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500">
              Create Tournament
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateTournamentForm;
