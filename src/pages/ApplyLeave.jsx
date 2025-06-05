import { useState, useEffect } from "react";
import axios from "axios";

const ApplyLeave = ({ userData }) => {
  const [formData, setFormData] = useState({
    employeeId: userData?.employeeId || "",
    firstName: userData?.firstName,
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userData?.employeeId) {
      setFormData((prev) => ({ ...prev, employeeId: userData.employeeId }));
    }
  }, [userData]);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Required fields validation
    if (!formData.startDate) {
      newErrors.startDate = "Start Date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End Date is required";
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    // Date validation
    if (formData.startDate) {
      const start = new Date(formData.startDate);
      if (start < today) {
        newErrors.startDate = "Start Date cannot be before today";
      }
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (start > end) {
        newErrors.date = "Start Date must be before End Date";
      }

      // Optional: Validate maximum leave duration (e.g., 30 days)
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 30) {
        newErrors.date = "Leave cannot be longer than 30 days";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/leave/apply",
        formData
      );
      setMessage(response.data.message);
      setFormData({
        ...formData,
        leaveType: "Sick Leave",
        firstName: userData?.firstName,
        startDate: "",
        endDate: "",
        reason: "",
        firstName: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Error applying for leave"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-0 flex flex-col md:flex-row overflow-hidden">
        {/* Left Section - Form */}
        <div className="md:w-1/2 w-full p-6">
          {/* Header Section */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mr-4 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Leave Application
              </h2>
              <p className="text-gray-200 text-sm font-medium">
                Submit Your Leave Request
              </p>
            </div>
          </div>

          {/* Employee Info Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Employee Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-800 block">
                  Employee ID:
                </span>
                <p className="text-gray-700">
                  {userData?.employeeId || "Loading..."}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-800 block">Name:</span>
                <p className="text-gray-700">
                  {userData?.firstName || "Loading..."}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type
              </label>
              <select
                value={formData.leaveType}
                onChange={(e) =>
                  setFormData({ ...formData, leaveType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-white shadow-sm transition duration-200"
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Earned Leave">Earned Leave</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-white shadow-sm transition duration-200"
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-white shadow-sm transition duration-200"
                />
              </div>
            </div>
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date}</p>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 bg-white shadow-sm transition duration-200 resize-none"
                rows="3"
                placeholder="Briefly explain your reason"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </button>

            {/* Status Message */}
            {message && (
              <div
                className={`p-3 rounded-lg text-center text-sm font-medium ${
                  message.includes("Error")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Built-in SVG Illustration */}
        <div className="md:w-1/2 w-full bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-6">
          <div className="transition-transform duration-300 hover:scale-105 w-full max-w-md">
            {/* Custom Break Time Illustration */}
            <svg viewBox="0 0 650 500" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="99.5"
                  y1="180.5"
                  x2="570.5"
                  y2="498"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6366F1" />
                  <stop offset="1" stopColor="#A855F7" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear"
                  x1="121"
                  y1="216"
                  x2="292"
                  y2="216"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#60A5FA" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>

              {/* Background elements */}
              <ellipse
                cx="325"
                cy="400"
                rx="280"
                ry="36"
                fill="#E0E7FF"
                opacity="0.5"
              />

              {/* Calendar or time icon */}
              <circle
                cx="325"
                cy="170"
                r="100"
                fill="url(#paint0_linear)"
                opacity="0.1"
              />

              {/* Character resting */}
              <rect
                x="250"
                y="280"
                width="150"
                height="10"
                rx="5"
                fill="#D1D5DB"
              />
              <rect
                x="220"
                y="300"
                width="210"
                height="60"
                rx="10"
                fill="#C7D2FE"
              />
              <rect
                x="240"
                y="320"
                width="170"
                height="20"
                rx="10"
                fill="#818CF8"
              />

              {/* Coffee cup */}
              <circle cx="180" cy="270" r="30" fill="#C4B5FD" />
              <rect
                x="165"
                y="270"
                width="30"
                height="40"
                rx="5"
                fill="#8B5CF6"
              />
              <path
                d="M165 275C165 272.239 167.239 270 170 270H190C192.761 270 195 272.239 195 275V290C195 295.523 190.523 300 185 300H175C169.477 300 165 295.523 165 290V275Z"
                fill="#A78BFA"
              />
              <path
                d="M195 275H205C207.761 275 210 277.239 210 280V280C210 282.761 207.761 285 205 285H195V275Z"
                fill="#A78BFA"
              />

              {/* Clock or leave symbol */}
              <circle cx="440" cy="230" r="40" fill="#93C5FD" />
              <circle cx="440" cy="230" r="35" fill="#DBEAFE" />
              <rect
                x="438"
                y="200"
                width="4"
                height="30"
                rx="2"
                fill="#1E40AF"
              />
              <rect
                x="438"
                y="230"
                width="4"
                height="20"
                rx="2"
                transform="rotate(-90 438 230)"
                fill="#1E40AF"
              />
              <rect
                x="440"
                y="228"
                width="4"
                height="15"
                rx="2"
                transform="rotate(45 440 228)"
                fill="#1E40AF"
              />

              {/* Small decorative elements */}
              <circle cx="150" cy="180" r="10" fill="#BFDBFE" />
              <circle cx="500" cy="150" r="15" fill="#C7D2FE" />
              <circle cx="540" cy="260" r="8" fill="#DDD6FE" />
              <circle cx="180" cy="350" r="12" fill="#E0E7FF" />
              <circle cx="480" cy="330" r="10" fill="#DBEAFE" />

              {/* Calendar representation */}
              <rect
                x="280"
                y="150"
                width="90"
                height="80"
                rx="8"
                fill="white"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              <rect
                x="280"
                y="150"
                width="90"
                height="20"
                rx="8"
                fill="#8B5CF6"
              />
              <line
                x1="300"
                y1="170"
                x2="300"
                y2="230"
                stroke="#DDD6FE"
                strokeWidth="1"
              />
              <line
                x1="320"
                y1="170"
                x2="320"
                y2="230"
                stroke="#DDD6FE"
                strokeWidth="1"
              />
              <line
                x1="340"
                y1="170"
                x2="340"
                y2="230"
                stroke="#DDD6FE"
                strokeWidth="1"
              />
              <line
                x1="280"
                y1="190"
                x2="370"
                y2="190"
                stroke="#DDD6FE"
                strokeWidth="1"
              />
              <line
                x1="280"
                y1="210"
                x2="370"
                y2="210"
                stroke="#DDD6FE"
                strokeWidth="1"
              />
              <circle cx="320" cy="200" r="5" fill="#8B5CF6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
