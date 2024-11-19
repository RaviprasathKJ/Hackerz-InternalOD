import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/Auth";
import axios from "axios";

const HodHero = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [uniqueReasons, setUniqueReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("All");  // Set default to "All"
  const [batchTimings, setBatchTimings] = useState({ from_time: "", to_time: "" });
  const [showBatchTimingForm, setShowBatchTimingForm] = useState(false);
  const [reasonDescription, setReasonDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [descriptions, setDescriptions] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    if (!isAuthenticated(navigate) || getRole(navigate) !== 'hod') {
      navigate('/login');
    } else {
      fetchPendingRequests();
    }
  }, [navigate]);

  useEffect(() => {
    const reasons = ["All", ...new Set(requests.map(request => request.reason))];
    setUniqueReasons(reasons);
    
    // Group descriptions by reason
    const descriptionsByReason = requests.reduce((acc, request) => {
      if (!acc[request.reason]) {
        acc[request.reason] = new Set();
      }
      acc[request.reason].add(request.description);
      return acc;
    }, {});

    // Convert Sets to arrays
    const processedDescriptions = Object.entries(descriptionsByReason).reduce((acc, [reason, descSet]) => {
      acc[reason] = Array.from(descSet);
      return acc;
    }, {});

    setDescriptions(processedDescriptions);
  }, [requests]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/pending-students/today`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRequests(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      setError("Error fetching requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason === selectedReason ? "" : reason);
    setSelectedRequests([]);
  };

  const getFilteredRequests = () => {
    if (!selectedReason || selectedReason === "All") {
      return requests;
    }
    return requests.filter(request => request.reason === selectedReason);
  };

  const selectAllForReason = () => {
    if (!selectedReason) return;
    
    const filteredRequests = getFilteredRequests();
    setSelectedRequests(filteredRequests.map(request => request.od_id));
  };

  const deselectAllForReason = () => {
    setSelectedRequests([]);
  };

  const toggleSelection = (odId) => {
    setSelectedRequests(prev => {
      if (prev.includes(odId)) {
        return prev.filter(id => id !== odId);
      } else {
        return [...prev, odId];
      }
    });
  };

  const handleBatchTimingChange = (field, value) => {
    setBatchTimings((prevTimings) => ({
      ...prevTimings,
      [field]: value,
    }));
  };

  const formatTime = (time) => {
    const [hour, min] = time.split(":").slice(0, 2);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${min} ${ampm}`;
  };

  const handleModifyTimings = async () => {
    if (selectedRequests.length === 0) {
      setError("Please select students to modify timings");
      return;
    }

    try {
      const { from_time, to_time } = batchTimings;
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/modifyRequest`, {
        userIds: selectedRequests,
        from_time,
        to_time,
        status: 1 // Set status to 1 for selected students
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShowBatchTimingForm(false);
      fetchPendingRequests();
    } catch (error) {
      console.error("Error modifying request timings:", error);
      setError("Error modifying timings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (selectedRequests.length === 0) {
      setError("Please select students to approve");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/acceptRequest`, {
        userIds: selectedRequests,
        status: 1 // Set status to 1 for approval
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSelectedRequests([]);
      setSelectedReason("");
      fetchPendingRequests();
    } catch (error) {
      console.error("Error approving requests:", error);
      setError("Error approving requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (selectedRequests.length === 0) {
      setError("Please select students to reject");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/rejectRequest`, {
        userIds: selectedRequests,
        status: -1 // Set status to -1 for rejection
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSelectedRequests([]);
      setSelectedReason("");
      fetchPendingRequests();
    } catch (error) {
      console.error("Error rejecting requests:", error);
      setError("Error rejecting requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-700">
        Approve or Reject On Duty Requests
      </h1>
      
      {error && (
        <div className="text-red-500 mb-4 p-2 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {uniqueReasons.map((reason) => (
          <button
            key={reason}
            onClick={() => handleReasonSelect(reason)}
            className={`p-4 rounded-lg shadow-md text-center transition-all ${
              selectedReason === reason
                ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                : 'bg-white hover:bg-blue-50'
            }`}
          >
            <div className="font-medium">{reason}</div>
            {reason === "All" ? (
              <div className="text-sm mt-1">
                ({requests.length} students)
              </div>
            ) : (
              <div className="text-sm mt-1">
                ({requests.filter(r => r.reason === reason).length} students)
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedReason && (
        <div className="mb-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Descriptions:</h3>
            <div className="space-y-2">
              {selectedReason === "All" ? (
                Object.entries(descriptions).map(([reason, descList]) => (
                  <div key={reason} className="ml-4">
                    <h4 className="font-medium text-gray-700">{reason}:</h4>
                    <ul className="list-disc ml-4">
                      {descList.map((desc, index) => (
                        <li key={index} className="text-gray-700">{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <ul className="list-disc ml-4">
                  {descriptions[selectedReason]?.map((desc, index) => (
                    <li key={index} className="text-gray-700">{desc}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="space-x-4">
              <button
                onClick={selectAllForReason}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Select All Students
              </button>
              <button
                onClick={deselectAllForReason}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
              >
                Deselect All Students
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {selectedRequests.length} students selected
            </div>
          </div>
        </div>
      )}


      {selectedReason && (
        <div className="mb-4 max-h-[50vh] overflow-y-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Select</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border">Section</th>
                <th className="px-4 py-2 border">Year</th>
                {selectedReason === "All" && (
                  <th className="px-4 py-2 border">Reason</th>
                )}
                <th className="px-4 py-2 border">From Time</th>
                <th className="px-4 py-2 border">To Time</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredRequests().map((request) => (
                <tr 
                  key={request.od_id}
                  className={selectedRequests.includes(request.od_id) ? "bg-blue-50" : ""}
                >
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="checkbox"
                      checked={selectedRequests.includes(request.od_id)}
                      onChange={() => toggleSelection(request.od_id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-2 border">{request.name}</td>
                  <td className="px-4 py-2 border">{request.dept}</td>
                  <td className="px-4 py-2 border">{request.sec}</td>
                  <td className="px-4 py-2 border">{request.year}</td>
                  {selectedReason === "All" && (
                    <td className="px-4 py-2 border">{request.reason}</td>
                  )}
                  <td className="px-4 py-2 border">{formatTime(request.from_time)}</td>
                  <td className="px-4 py-2 border">{formatTime(request.to_time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequests.length > 0 && (
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowBatchTimingForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Modify Timings
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Approving..." : "Approve"}
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
      )}

      {showBatchTimingForm && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <h2 className="text-lg font-bold mb-4">Modify Batch Timings</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleModifyTimings();
            }}
            className="space-y-4"
          >
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Time</label>
                <input
                  type="time"
                  value={batchTimings.from_time}
                  onChange={(e) => handleBatchTimingChange('from_time', e.target.value)}
                  className="border px-4 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Time</label>
                <input
                  type="time"
                  value={batchTimings.to_time}
                  onChange={(e) => handleBatchTimingChange('to_time', e.target.value)}
                  className="border px-4 py-2 rounded"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowBatchTimingForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default HodHero;