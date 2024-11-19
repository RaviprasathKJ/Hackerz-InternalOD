import  { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from "../components/Hero"
import ApprovedStudents from '../components/ApprovedStudents';
import PendingStudents from '../components/PendingStudents';
import RejectedStudents from '../components/RejectedStudents';
import logo from '../assets/logo.png';
import { isAuthenticated, getRole } from '../utils/Auth';

const TeamLead = () => {

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated(navigate) || getRole(navigate) !== 'teamlead') {
      navigate('/login');
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute top-0 right-8 z-50">
        <img src={logo} alt="Logo" className="h-[100px] w-[100px]" />
      </div>
      <div className="flex flex-grow">
        <Navbar />
        <div className="flex-grow p-6 mt-28">
          <Routes>
            <Route path="/" element={<Navigate to="/teamlead/send-request" />} />
            <Route path="/send-request" element={<Hero />} />
            <Route path="/approved-students" element={<ApprovedStudents />} />
            <Route path="/pending-students" element={<PendingStudents />} />
            <Route path="/rejected-students" element={<RejectedStudents />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default TeamLead;
