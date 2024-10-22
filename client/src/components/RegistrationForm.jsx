import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegistrationForm = () => {
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(4, 'Username must be at least 4 characters')
      .required('Username is required'),
    team_name: Yup.string().required('Team name is required'),
    date: Yup.date().required('Tournament date is required'),
  });

  const handleSubmit = (values) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    }).then(response => {
      if (response.ok) {
        alert('Registration successful!');
      } else {
        alert('Registration failed. Please try again.');
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Register for Tournament</h1>
      <Formik
        initialValues={{ username: '', team_name: '', date: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
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
            <label htmlFor="team_name" className="block text-white">Team Name</label>
            <Field
              name="team_name"
              type="text"
              className="bg-gray-700 text-white p-2 rounded w-full"
            />
            <ErrorMessage name="team_name" component="div" className="text-red-400" />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-white">Tournament Date</label>
            <Field
              name="date"
              type="date"
              className="bg-gray-700 text-white p-2 rounded w-full"
            />
            <ErrorMessage name="date" component="div" className="text-red-400" />
          </div>

          <button type="submit" className="bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500">
            Register
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default RegistrationForm;
