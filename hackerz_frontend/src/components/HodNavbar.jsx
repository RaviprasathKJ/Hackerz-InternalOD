import React, { useState } from "react";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiThumbsUp,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

const HodNavbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div
      className={`h-screen ${isOpen ? "w-64" : "w-20"
        } bg-gray-700 text-white fixed flex flex-col transition-all duration-300 ease-in-out z-50`}
    >
      <div className="flex items-center justify-between h-20 border-b border-gray-700 px-4">
        <button onClick={toggleNavbar} className="text-3xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
        {isOpen && <h1 className="text-3xl font-semibold">HOD</h1>}
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-4">
          <li>
            <NavLink
              to="approve-request"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-white"
              }
            >
              <div className="flex items-center transition-all duration-300 ease-in-out">
                <FiCheckCircle className="mr-2 text-2xl" />
                {isOpen && <span className="text-lg">Approve Requests</span>}
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="approved-students"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-white"
              }
            >
              <div className="flex items-center transition-all duration-300 ease-in-out">
                <FiThumbsUp className="mr-2 text-2xl" />
                {isOpen && <span className="text-lg">Approved Students</span>}
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="pending-students"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-white"
              }
            >
              <div className="flex items-center transition-all duration-300 ease-in-out">
                <FiClock className="mr-2 text-2xl" />
                {isOpen && <span className="text-lg">Pending Students</span>}
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="rejected-students"
              className={({ isActive }) =>
                isActive ? "text-blue-500" : "text-white"
              }
            >
              <div className="flex items-center transition-all duration-300 ease-in-out">
                <FiXCircle className="mr-2 text-2xl" />
                {isOpen && <span className="text-lg">Rejected Students</span>}
              </div>
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left text-white hover:text-red-500 transition-all duration-300 ease-in-out"
            >
              <FiLogOut className="mr-2 text-2xl" />
              {isOpen && <span className="text-lg">Logout</span>}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HodNavbar;
