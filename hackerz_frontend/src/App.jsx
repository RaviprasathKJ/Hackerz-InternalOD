
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Hod from './pages/Hod';
import TeamLead from './pages/TeamLead';

import Footer from './components/Footer';

import ApproveReq from './components/ApproveReq';const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
        <Route path="/" element={<Navigate to="/approve-students" />} />
        <Route path="/approve-students" element={<ApproveReq />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hod/*" element={<Hod />} />
          <Route path="/teamlead/*" element={<TeamLead />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;