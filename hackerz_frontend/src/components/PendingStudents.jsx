import React, { useEffect, useState } from "react";
import { FiPrinter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isAuthenticated } from "../utils/Auth";

const PendingStudents = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated(navigate)) {
      navigate('/login');
    } else {
      fetchPendingStudents();
    }
  }, [navigate]);

  const fetchPendingStudents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/pending-students/today`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching pending students:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatTime = (time) => {
    const [hour, min] = time.split(":").slice(0, 2);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${min} ${ampm}`;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
          Pending Students
        </h1>
        <button
          onClick={handlePrint}
          className="flex items-center bg-blue-400 text-white px-2 py-2 left rounded hover:bg-blue-500 transition duration-200"
        >
          <FiPrinter size={20} />
        </button>
      </div>
      <div className="mb-4 max-h-[50vh] overflow-y-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Department</th>
              <th className="px-4 py-2 border">Section</th>
              <th className="px-4 py-2 border">Year</th>
              <th className="px-4 py-2 border">Reason</th>
              <th className="px-4 py-2 border">From Time</th>
              <th className="px-4 py-2 border">To Time</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-2 border">{student.name}</td>
                <td className="px-4 py-2 border">{student.dept}</td>
                <td className="px-4 py-2 border">{student.sec}</td>
                <td className="px-4 py-2 border">{student.year}</td>
                <td className="px-4 py-2 border">{student.reason}</td>
                <td className="px-4 py-2 border">{formatTime(student.from_time)}</td>
                <td className="px-4 py-2 border">{formatTime(student.to_time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingStudents;

