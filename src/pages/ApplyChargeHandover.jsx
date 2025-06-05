import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ApplyChargeHandoverForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    designation: "",
    department: "",
    handoverStartDate: "",
    handoverEndDate: "",
    handoverReason: "",
    receiverName: "",
    receiverDesignation: "",
    documents: [],
    assets: [],
    pendingTasks: [],
    remarks: "",
    status: "pending",
  });
  const [tempItem, setTempItem] = useState("");
  const [itemType, setItemType] = useState("documents");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.token || localStorage.getItem("authToken");

        if (!token) {
          setError("Please log in to continue");
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();

          setFormData((prev) => ({
            ...prev,
            employeeName: userData.name || "",
            employeeId: userData.employeeId || "",
            designation: userData.designation || "",
            department: userData.department || "",
          }));
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch user profile");

          if (response.status === 401) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
            navigate("/login");
          }
        }
      } catch (err) {
        setError("Failed to connect to the server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddItem = () => {
    if (tempItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        [itemType]: [...prev[itemType], tempItem.trim()],
      }));
      setTempItem("");
    }
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      [itemType]: prev[itemType].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (
        !formData.employeeName ||
        !formData.employeeId ||
        !formData.designation ||
        !formData.department ||
        !formData.handoverStartDate ||
        !formData.handoverEndDate ||
        !formData.handoverReason ||
        !formData.receiverName ||
        !formData.receiverDesignation
      ) {
        throw new Error("Please fill all required fields");
      }

      const startDate = new Date(formData.handoverStartDate);
      const endDate = new Date(formData.handoverEndDate);
      if (startDate > endDate) {
        throw new Error("End date must be after start date");
      }

      const payload = {
        ...formData,
        handoverStartDate: startDate,
        handoverEndDate: endDate,
        reportingManager: formData.employeeName,
      };

      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token || localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      await axios.post("http://localhost:5000/api/tasks", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
      setTimeout(() => navigate("/tasks"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Submission failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 w-full min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      )}

      <div className="mx-auto max-w-3xl bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
          Charge Handover Form
        </h1>

        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-300 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-2 bg-green-50 border border-green-300 text-green-600 rounded-lg text-sm">
            Form submitted successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Details */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Basic Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["employeeName", "employeeId", "designation", "department"].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-600">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                )
              )}
            </div>
          </section>

          {/* Handover Details */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Charge Handover Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date of Handover
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-gray-500">Start Date</span>
                    <input
                      type="date"
                      name="handoverStartDate"
                      value={formData.handoverStartDate}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">End Date</span>
                    <input
                      type="date"
                      name="handoverEndDate"
                      value={formData.handoverEndDate}
                      onChange={handleChange}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Reason for Handover
                </label>
                <select
                  name="handoverReason"
                  value={formData.handoverReason}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Reason</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Resignation">Resignation</option>
                  <option value="Leave">Leave</option>
                  <option value="Promotion">Promotion</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Receiver's Name
                </label>
                <input
                  type="text"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  placeholder="Enter Receiver's Name"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Receiver's Designation
                </label>
                <select
                  name="receiverDesignation"
                  value={formData.receiverDesignation}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Principal">Principal</option>
                  <option value="Vice Principal">Vice Principal</option>
                  <option value="Head of Department (HOD)">HOD</option>
                  <option value="Assistant Professor">
                    Assistant Professor
                  </option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Lab Assistant">Lab Assistant</option>
                  <option value="Clerk">Clerk</option>
                  <option value="Office Assistant">Office Assistant</option>
                  <option value="System Administrator">
                    System Administrator
                  </option>
                  <option value="Peon">Peon</option>
                  <option value="Security Guard">Security Guard</option>
                </select>
              </div>
            </div>
          </section>

          {/* Assets / Responsibilities */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Assets / Responsibilities
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/2 flex flex-col gap-3">
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg w-full"
                >
                  <option value="documents">Documents</option>
                  <option value="assets">Assets</option>
                  <option value="pendingTasks">Pending Tasks</option>
                </select>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempItem}
                    onChange={(e) => setTempItem(e.target.value)}
                    placeholder={`Add ${itemType}`}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="sm:w-1/2 p-2 border border-gray-300 rounded-lg">
                {formData[itemType].length > 0 ? (
                  <>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">
                      {itemType.charAt(0).toUpperCase() + itemType.slice(1)} (
                      {formData[itemType].length})
                    </h4>
                    <ul className="space-y-1">
                      {formData[itemType].map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm"
                        >
                          <span className="truncate flex-1 mr-2">{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No {itemType} added yet
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Remarks */}
          <section>
            <label className="block text-sm font-medium text-gray-600">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional remarks..."
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
            />
          </section>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
