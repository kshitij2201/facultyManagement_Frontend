import { useState, useEffect } from "react";
import axios from "axios";

const ApproveLeave = ({ userData }) => {
  const [department, setDepartment] = useState(userData?.department || "");
  const [hodEmployeeId, setHodEmployeeId] = useState(
    userData?.employeeId || ""
  );
  const [leaves, setLeaves] = useState([]);
  const [decision, setDecision] = useState({
    leaveId: "",
    decision: "Approved",
    comment: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch leave requests when department or userData changes
  useEffect(() => {
    const fetchLeaves = async () => {
      if (!department || !hodEmployeeId || !userData?.token) {
        setMessage("Missing department, employee ID, or authentication token");
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `faculty-management-backend.vercel.app/api/leave/hod/${encodeURIComponent(
            department
          )}`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        // Filter leaves to ensure department matches (extra client-side check)
        const filteredLeaves = Array.isArray(res.data)
          ? res.data.filter((leave) => leave.department === department)
          : [];
        setLeaves(filteredLeaves);
        setMessage(
          filteredLeaves.length === 0
            ? "No pending requests for this department."
            : ""
        );
      } catch (err) {
        setMessage(err.response?.data?.message || "Error fetching leaves");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [department, hodEmployeeId, userData?.token]);

  const handleDecision = async (e) => {
    e.preventDefault();
    if (!decision.leaveId) {
      setMessage("Please select a leave request to review");
      return;
    }
    if (!/^[0-9a-fA-F]{24}$/.test(decision.leaveId)) {
      setMessage("Invalid leave ID format");
      console.error("Invalid leaveId:", decision.leaveId);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `faculty-management-backend.vercel.app/api/leave/hod/${decision.leaveId}`,
        {
          hodEmployeeId,
          decision: decision.decision,
          comment: decision.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      setMessage(res.data.message || "Decision recorded successfully");
      setDecision({ leaveId: "", decision: "Approved", comment: "" });

      // Remove decided leave from local state
      setLeaves((prevLeaves) =>
        prevLeaves.filter((l) => l._id !== decision.leaveId)
      );
    } catch (err) {
      setMessage(err.response?.data?.message || "Error processing decision");
      console.error("Decision error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 mt-12 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-4xl font-bold mb-10 text-center text-blue-700">
        HOD Dashboard
      </h2>

      {/* Department Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Department:
          </label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly={!!userData?.department}
          />
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            HOD Employee ID:
          </label>
          <input
            type="text"
            value={hodEmployeeId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            readOnly
          />
        </div>
      </div>

      {/* Pending Leaves */}
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">
        Pending Leave Requests
      </h3>
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Loading leave requests...</p>
        </div>
      ) : leaves.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-blue-100 text-gray-800 font-medium">
              <tr>
                <th className="px-4 py-3 border">Employee ID</th>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Leave Type</th>
                <th className="px-4 py-3 border">Type</th>
                <th className="px-4 py-3 border">Start Date</th>
                <th className="px-4 py-3 border">End Date</th>
                <th className="px-4 py-3 border">Reason</th>
                <th className="px-4 py-3 border">Days</th>
                <th className="px-4 py-3 border">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {leaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-blue-50 transition-all">
                  <td className="px-4 py-3 border">{leave.employeeId}</td>
                  <td className="px-4 py-3 border">{leave.name}</td>
                  <td className="px-4 py-3 border">{leave.leaveType}</td>
                  <td className="px-4 py-3 border">{leave.type}</td>
                  <td className="px-4 py-3 border">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border">{leave.reason}</td>
                  <td className="px-4 py-3 border">{leave.leaveDays}</td>
                  <td className="px-4 py-3 border">
                    <button
                      onClick={() =>
                        setDecision({
                          leaveId: leave._id,
                          decision: "Approved",
                          comment: "",
                        })
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      disabled={loading}
                    >
                      Take Action
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">
          {message || "No pending requests for this department."}
        </p>
      )}

      {/* Decision Form */}
      {decision.leaveId && (
        <form
          onSubmit={handleDecision}
          className="mt-10 bg-gray-50 p-6 rounded-xl border space-y-5"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            Make a Decision
          </h3>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Decision:
            </label>
            <select
              value={decision.decision}
              onChange={(e) =>
                setDecision((prev) => ({ ...prev, decision: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="Approved">Approve</option>
              <option value="Rejected">Reject</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Comment:</label>
            <textarea
              value={decision.comment}
              onChange={(e) =>
                setDecision((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Optional comment"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit Decision"}
          </button>
        </form>
      )}

      {/* Notification */}
      {message && (
        <p
          className={`mt-6 text-center font-semibold ${
            message.toLowerCase().includes("error")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};
export default ApproveLeave;