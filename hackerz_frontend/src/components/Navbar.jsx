import React, { useState, useEffect } from "react";
import { FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import {
  AiOutlineSend,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const closeNavbar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex items-center h-16 px-4 bg-gray-700 md:hidden">
        <button onClick={toggleNavbar} className="text-white text-3xl">
          <FiMenu />
        </button>
      </div>

      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeNavbar}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen bg-gray-700 text-white transition-all duration-300 ease-in-out z-50
          ${isMobile 
            ? `${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64` 
            : `${isOpen ? 'w-64' : 'w-20'}`
          }`}
      >
        <div className="flex items-center justify-between h-20 border-b border-gray-600 px-4">
          <button onClick={toggleNavbar} className="text-3xl">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
          {isOpen && <h1 className="text-3xl font-semibold">Team Lead</h1>}
        </div>

        <nav className="flex-grow p-4">
          <ul className="space-y-4">
            <li>
              <NavLink
                to="send-request"
                className={({ isActive }) =>
                  `block transition-colors duration-200 ${isActive ? "text-blue-500" : "text-white hover:text-blue-300"}`
                }
                onClick={closeNavbar}
              >
                <div className="flex items-center">
                  <AiOutlineSend className="mr-2 text-2xl" />
                  {isOpen && <span className="text-lg">Send Requests</span>}
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="approved-students"
                className={({ isActive }) =>
                  `block transition-colors duration-200 ${isActive ? "text-blue-500" : "text-white hover:text-blue-300"}`
                }
                onClick={closeNavbar}
              >
                <div className="flex items-center">
                  <AiOutlineCheckCircle className="mr-2 text-2xl" />
                  {isOpen && <span className="text-lg">Approved Students</span>}
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="pending-students"
                className={({ isActive }) =>
                  `block transition-colors duration-200 ${isActive ? "text-blue-500" : "text-white hover:text-blue-300"}`
                }
                onClick={closeNavbar}
              >
                <div className="flex items-center">
                  <AiOutlineClockCircle className="mr-2 text-2xl" />
                  {isOpen && <span className="text-lg">Pending Students</span>}
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="rejected-students"
                className={({ isActive }) =>
                  `block transition-colors duration-200 ${isActive ? "text-blue-500" : "text-white hover:text-blue-300"}`
                }
                onClick={closeNavbar}
              >
                <div className="flex items-center">
                  <AiOutlineCloseCircle className="mr-2 text-2xl" />
                  {isOpen && <span className="text-lg">Rejected Students</span>}
                </div>
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => {
                  closeNavbar();
                  handleLogout();
                }}
                className="flex items-center w-full text-white hover:text-red-500 transition-colors duration-200"
              >
                <FiLogOut className="mr-2 text-2xl" />
                {isOpen && <span className="text-lg">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;