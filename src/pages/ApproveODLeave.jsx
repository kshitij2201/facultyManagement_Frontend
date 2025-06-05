import { useState } from "react";
import { Calendar, MapPin, ChevronDown, User } from "lucide-react";

// Sample leave request data
const initialLeaveRequests = [
  {
    id: 1,
    employee: "John Doe",
    department: "Computer Science",
    startDate: "5/15/2025",
    endDate: "5/17/2025",
    days: "3 days",
    leaveType: "Conference Presentation",
    location: "IEEE Conference, Mumbai",
  },
  {
    id: 2,
    employee: "Jane Smith",
    department: "Information Technology",
    startDate: "5/20/2025",
    endDate: "5/21/2025",
    days: "2 days",
    leaveType: "Workshop",
    location: "AI Workshop, Bangalore",
  },
  {
    id: 3,
    employee: "Michael Brown",
    department: "Computer Science",
    startDate: "5/25/2025",
    endDate: "5/25/2025",
    days: "1 day",
    leaveType: "Industry Visit",
    location: "Tech Park, Chennai",
  },
];

export default function ApproveOnDutyLeave() {
  const [leaveRequests] = useState(initialLeaveRequests);
  const [selectedFilter, setSelectedFilter] = useState("All Requests");
  const [showDropdown, setShowDropdown] = useState(false);

  const filterOptions = ["All Requests", "Pending", "Approved", "Rejected"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-gray-900 py-4">
          Approve On-Duty Leave Requests
        </h1>

        {/* Filter Dropdown */}
        <div className="relative mb-4">
          <button
            className="w-full sm:w-48 flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 bg-white text-left text-sm"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedFilter}
            <ChevronDown size={16} />
          </button>

          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full sm:w-48 bg-white border border-gray-300 rounded-md shadow-lg">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setSelectedFilter(option);
                    setShowDropdown(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section Title */}
        <div className="bg-white p-4 border-b border-gray-200 mb-4">
          <h2 className="text-lg font-medium text-gray-700">
            OD Leave Requests
          </h2>
        </div>

        {/* Leave Requests List */}
        <div className="space-y-4">
          {leaveRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white border border-gray-200 rounded-sm p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="space-y-4">
                  {/* Employee Info */}
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-2 text-blue-600">
                      <User size={20} />
                    </div>
                    <span className="font-medium text-gray-900">
                      {request.employee}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {request.department}
                    </span>
                  </div>

                  {/* Date Info */}
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-2 text-gray-500">
                      <Calendar size={20} />
                    </div>
                    <span className="text-sm text-gray-600">
                      {request.startDate} - {request.endDate}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {request.days}
                    </span>
                  </div>

                  {/* Leave Type */}
                  <div>
                    <span className="inline-block text-sm text-blue-600">
                      {request.leaveType}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center">
                    <div className="w-5 h-5 mr-2 text-gray-500">
                      <MapPin size={20} />
                    </div>
                    <span className="text-sm text-gray-600">
                      {request.location}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex mt-4 sm:mt-0 space-x-2">
                  <button className="px-4 py-2 border border-red-200 rounded-md text-red-600 hover:bg-red-50 flex items-center justify-center">
                    <span className="mr-1">•</span> Reject
                  </button>
                  <button className="px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-700 flex items-center justify-center">
                    <span className="mr-1">✓</span> Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}