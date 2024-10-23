import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white py-4 px-8 flex justify-between items-center">
      {/* Logo / Brand */}
      <div className="text-2xl font-bold text-green-400">
        <NavLink to="/" className="hover:text-green-300">
          Tournament Hub
        </NavLink>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-green-400 border-b-2 border-green-400 pb-2" : "hover:text-green-400"
            }
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tournaments"
            className={({ isActive }) =>
              isActive ? "text-green-400 border-b-2 border-green-400 pb-2" : "hover:text-green-400"
            }
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            Tournaments
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ? "text-green-400 border-b-2 border-green-400 pb-2" : "hover:text-green-400"
            }
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            Register
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/my-registrations"
            className={({ isActive }) =>
              isActive ? "text-green-400 border-b-2 border-green-400 pb-2" : "hover:text-green-400"
            }
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            My Registrations
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
