import { useState } from "react";
import { Calendar, ArrowRight, Upload, X, Check, Clock } from "lucide-react";

export default function LeaveApplicationForm() {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contact, setContact] = useState("");
  const [reason, setReason] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for date-only comparison

    if (!leaveType) newErrors.leaveType = "Leave Type is required";
    if (!startDate) newErrors.startDate = "Start Date is required";
    if (!endDate) newErrors.endDate = "End Date is required";
    if (!contact) newErrors.contact = "Contact is required";
    if (!reason) newErrors.reason = "Reason is required";

    if (startDate) {
      const start = new Date(startDate);
      if (start < today) {
        newErrors.startDate = "Start Date cannot be before today";
      }
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        newErrors.date = "Start Date must be before End Date";
      }
    }

    return newErrors;
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const clearFile = () => {
    setFileName("");
  };

  const handleCancel = () => {
    // Reset form fields and errors
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setContact("");
    setReason("");
    setFileName("");
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Clear errors and proceed with submission
    setErrors({});

    // You can add logic here to submit the form data (e.g., send to an API)

    alert("Leave application submitted successfully!");
    // Reset form after submission
    handleCancel();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Apply OD Leave</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
          <h2 className="text-xl font-semibold mb-6">Leave Application Form</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type
              </label>
              <div className="relative">
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className={`appearance-none bg-white border ${
                    errors.leaveType ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select leave type</option>
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="earned">Earned Leave</option>
                  <option value="sabbatical">Sabbatical</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </div>
              </div>
              {errors.leaveType && (
                <p className="mt-1 text-xs text-red-500">{errors.leaveType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`appearance-none bg-white border ${
                    errors.startDate || errors.date ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
              {errors.startDate && (
                <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>
              )}
              {errors.date && (
                <p className="mt-1 text-xs text-red-500">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`appearance-none bg-white border ${
                    errors.endDate || errors.date ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
              {errors.endDate && (
                <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact During Leave
              </label>
              <input
                type="text"
                placeholder="Phone number or email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={`appearance-none bg-white border ${
                  errors.contact ? "border-red-500" : "border-gray-300"
                } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.contact && (
                <p className="mt-1 text-xs text-red-500">{errors.contact}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Leave
            </label>
            <textarea
              rows={4}
              placeholder="Please provide details about your leave request"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`appearance-none bg-white border ${
                errors.reason ? "border-red-500" : "border-gray-300"
              } rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.reason && (
              <p className="mt-1 text-xs text-red-500">{errors.reason}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachment (if any)
            </label>

            {fileName ? (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md py-2 px-3">
                <span className="text-sm text-blue-700">{fileName}</span>
                <button
                  onClick={clearFile}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="border border-gray-300 rounded-md py-2 px-3 flex items-center justify-between cursor-pointer">
                  <span className="text-gray-500 text-sm">Choose File</span>
                  <Upload className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-1">
              Upload supporting documents if required (max 5MB)
            </p>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleCancel}
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-800"
            >
              Submit Application
            </button>
          </div>
        </div>

        {/* Right side - Leave Balance and Recent Applications */}
        {/* <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Leave Balance</h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Casual Leave:</span>
                <span className="font-medium">8 days remaining</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sick Leave:</span>
                <span className="font-medium">12 days remaining</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Earned Leave:</span>
                <span className="font-medium">15 days remaining</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sabbatical:</span>
                <span className="font-medium">30 days remaining</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>

            <div className="space-y-4">
              <div className="bg-green-50 rounded-md p-3 border border-green-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Casual Leave</h3>
                    <p className="text-sm text-gray-600">April 10-12, 2025</p>
                  </div>
                  <div className="flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    <Check className="h-3 w-3 mr-1" />
                    Approved
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-md p-3 border border-yellow-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Sick Leave</h3>
                    <p className="text-sm text-gray-600">March 24-25, 2025</p>
                  </div>
                  <div className="flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}