import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white py-4 px-8 flex justify-between items-center">
      <div className="text-2xl font-bold text-green-400">
        <NavLink to="/">Tournament Hub</NavLink>
      </div>
      <ul className="flex space-x-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-green-400 border-b-2 border-green-400 pb-2" : "hover:text-green-400"
            }
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
          >
            Register
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
