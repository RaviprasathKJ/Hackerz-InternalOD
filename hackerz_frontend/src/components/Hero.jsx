import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isAuthenticated, getRole } from "../utils/Auth";

const Hero = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [requestType, setRequestType] = useState("OD Request");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionsOptions, setSectionsOptions] = useState([]);
  const [yearsOptions, setYearsOptions] = useState([]);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    if (!isAuthenticated(navigate) || getRole(navigate) !== "teamlead") {
      navigate("/login");
    } else {
      fetchStudents();
    }
  }, [navigate]);

  useEffect(() => {
    const sections = [...new Set(students.map(student => student.sec))].sort();
    const years = [...new Set(students.map(student => student.year))].sort();
    setSectionsOptions(sections);
    setYearsOptions(years);
  }, [students]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSection, selectedYear]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/students`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Error fetching students");
    }
  };

  const handleSelectStudent = (id) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((studentId) => studentId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSendRequest = async () => {
    if (!reason || !fromTime || !toTime || !description || selectedStudents.length === 0) {
      setError("Please fill in all fields and select at least one student.");
      return;
    }
  
    const odDetailsArray = selectedStudents.map((studentId) => {
      const student = students.find((s) => s.user_id === studentId);
  
      // Default updateColumns object
      let updateColumns = {};
      
      // Add the request_type directly
      if (requestType === "Stayback Request") {
        updateColumns = { Stayback_cnt: student.Stayback_cnt + 1 };
      } else if (requestType === "Meeting Request") {
        updateColumns = { Meeting_cnt: student.Meeting_cnt + 1 };
      }
  
      console.log("Request Type:", requestType);
  
      // Ensure request_type is included along with other details
      return {
        user_id: student.user_id,
        date: new Date().toISOString().split("T")[0],
        reason,
        description,
        request_by: student.user_id,
        status: "0",
        from_time: fromTime,
        to_time: toTime,
        request_type: requestType,  // Ensure this is always included
        ...updateColumns,
      };
    });
  
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/sendRequest`, odDetailsArray, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccessMessage("Requests sent successfully!");
      setSelectedStudents([]);
      setReason("");
      setDescription("");
      setFromTime("");
      setToTime("");
      setError("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error sending requests:", error);
      setError("Error sending requests");
    }
  };
  

  const totalStudents = students.filter(
    (student) =>
      (selectedSection === "all" || student.sec === selectedSection) &&
      (selectedYear === "all" || student.year === selectedYear) &&
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalStudents.length);
  const currentStudents = totalStudents.slice(startIndex, endIndex);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-700">Send Requests</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      {/* Request Type */}
      <div className="flex gap-4 mb-4">
        {["OD Request", "Stayback Request", "Meeting Request"].map((type) => (
          <label key={type} className="flex items-center">
            <input
              type="radio"
              name="requestType"
              value={type}
              checked={requestType === type}
              onChange={() => setRequestType(type)}
              className="mr-2"
            />
            {type}
          </label>
        ))}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="all">All Sections</option>
          {sectionsOptions.map((section) => (
            <option key={section} value={section}>
              Section {section}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="all">All Years</option>
          {yearsOptions.map((year) => (
            <option key={year} value={year}>
              Year {year}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="mb-4 overflow-y-auto max-h-96">
        <table className="min-w-full bg-white border">
          <thead className="sticky top-0 bg-gray-200">
            <tr>
              {["Select", "Name", "Department", "Section", "Year", "Stayback", "Meeting"].map((header) => (
                <th key={header} className="px-4 py-2 border">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.user_id}>
                <td className="px-4 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.user_id)}
                    onChange={() => handleSelectStudent(student.user_id)}
                  />
                </td>
                <td className="px-4 py-2 border">{student.name}</td>
                <td className="px-4 py-2 border">{student.dept}</td>
                <td className="px-4 py-2 border">{student.sec}</td>
                <td className="px-4 py-2 border">{student.year}</td>
                <td className="px-4 py-2 border">{student.Stayback_cnt || 0}</td>
                <td className="px-4 py-2 border">{student.Meeting_cnt || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div>Showing {startIndex + 1} to {endIndex} of {totalStudents.length} entries</div>
        <div className="flex space-x-2">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>

      {/* Form Inputs */}
      <div className="space-y-4">
        <textarea
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        ></textarea>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        ></textarea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <input
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            className="px-4 py-2 border rounded"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button onClick={handleSendRequest} className="w-full py-2 bg-blue-500 text-white rounded mt-4">
        Send Request
      </button>
    </div>
  );
};

export default Hero;
