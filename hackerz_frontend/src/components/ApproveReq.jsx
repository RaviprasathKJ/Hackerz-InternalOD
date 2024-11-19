import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import axios from "axios"; 

const ApprovedStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedStudents();
  }, []);

  const fetchApprovedStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/approved-students`;
      console.log('Fetching from:', url);
      
      const token = localStorage.getItem("token");
      console.log('Token exists:', !!token);
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });
      
      console.log('Response data:', response.data); 
      setStudents(response.data);
    } catch (error) {
      console.error("Error details:", error.response || error);
      setError(error.response?.data?.message || error.message || "Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const formatTime = (time) => {
    const [hour, min] = time.split(":").slice(0, 2);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${min} ${ampm}`;
  };

  const years = [...new Set(students.map(student => student.year))].sort();
  const sections = [...new Set(students.map(student => student.sec))].sort();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === "" || student.year === selectedYear;
    const matchesSection = selectedSection === "" || student.sec === selectedSection;
    return matchesSearch && matchesYear && matchesSection;
  });

  return (
    <div className="">
      <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
            Approved Students on {new Date().toLocaleDateString()}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={handleLogin}
              className="flex items-center bg-blue-400 text-white px-2 py-2 rounded hover:bg-blue-500 transition duration-200"
            >
              Login
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, department, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Sections</option>
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading students...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-4">No students found</div>
        ) : (
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
                {filteredStudents.map((student, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 border">{student.name}</td>
                    <td className="px-4 py-2 border">{student.dept}</td>
                    <td className="px-4 py-2 border">{student.sec}</td>
                    <td className="px-4 py-2 border">{student.year}</td>
                    <td className="px-4 py-2 border">{student.reason}</td>
                    <td className="px-4 py-2 border">
                      {formatTime(student.from_time)}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatTime(student.to_time)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovedStudents;