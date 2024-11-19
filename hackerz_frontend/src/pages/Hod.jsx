import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HodNavbar from '../components/HodNavbar';
import HodHero from '../components/HodHero';
import ApprovedStudents from '../components/ApprovedStudents';
import PendingStudents from '../components/PendingStudents';
import RejectedStudents from '../components/RejectedStudents';
import logo from '../assets/logo.png';
import { isAuthenticated, getRole } from '../utils/Auth';

const Hod = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated(navigate) || getRole(navigate) !== 'hod') {
      navigate('/login');
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute top-0 right-8 z-50">
        <img src={logo} alt="Logo" className="h-[100px] w-[100px]" />
      </div>
      <div className="flex flex-grow">
        <HodNavbar />
        <div className="flex-grow p-6 mt-28">
          <Routes>
            <Route path="/" element={<Navigate to="/hod/approve-request" />} />
            <Route path="/approve-request" element={<HodHero />} />
            <Route path="/approved-students" element={<ApprovedStudents />} />
            <Route path="/pending-students" element={<PendingStudents />} />
            <Route path="/rejected-students" element={<RejectedStudents />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Hod;