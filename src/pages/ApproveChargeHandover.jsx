import { useState } from "react";
import { ArrowDown, User, Calendar, Info, Check, X } from "lucide-react";

export default function ChargeHandoverApp() {
  const [requests, setRequests] = useState([
    {
      id: "CHR001",
      department: "Computer Science",
      from: { name: "John Doe" },
      to: { name: "Jane Smith" },
      duration: { start: "3/15/2025", end: "3/25/2025" },
      reason: "Going on a medical leave due to planned surgery",
      responsibilities: [
        { role: "Class Coordinator", person: "Exam Committee" },
        { role: "Time Table In-charge", person: "" },
      ],
      pending: true,
      status: "",
    },
    {
      id: "CHR002",
      department: "Information Technology",
      from: { name: "Michael Brown" },
      to: { name: "Robert Taylor" },
      duration: { start: "5/05/2025", end: "6/5/2025" },
      reason: "Attending an international conference",
      responsibilities: [
        { role: "Department System Admin", person: "" },
        { role: "Lab Coordinator", person: "" },
      ],
      pending: true,
      status: "",
    },
    {
      id: "CHR003",
      department: "Computer Science",
      from: { name: "Emily Wilson" },
      to: { name: "David Clark" },
      duration: { start: "6/1/2025", end: "6/10/2025" },
      reason: "Personal leave for family function",
      responsibilities: [
        { role: "Placement Coordinator", person: "" },
        { role: "Student Counselor", person: "" },
      ],
      pending: true,
      status: "",
    },
  ]);

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, pending: false, status: "Approved" } : req
      )
    );
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, pending: false, status: "Rejected" } : req
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Approve Charge Handover Requests
            </h1>

            <div className="mt-4">
              <div className="relative inline-block">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  All Requests
                  <ArrowDown className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">
              Charge Handover Requests
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {requests.map((request) => (
              <div key={request.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center mb-4 md:mb-0">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded mr-3">
                      {request.department}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      Request #{request.id}
                    </span>
                  </div>
                  {request.pending && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleReject(request.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded text-green-700 bg-white hover:bg-green-50"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500">
                          Charge From:
                        </span>
                      </div>
                      <div className="text-sm text-gray-900 ml-6">
                        {request.from.name}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500">
                          Duration:
                        </span>
                      </div>
                      <div className="text-sm text-gray-900 ml-6">
                        {request.duration.start} - {request.duration.end}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <Info className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500">
                          Reason:
                        </span>
                      </div>
                      <div className="text-sm text-gray-900 ml-6">
                        {request.reason}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500">
                          Charge To:
                        </span>
                      </div>
                      <div className="text-sm text-gray-900 ml-6">
                        {request.to.name}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <Info className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-500">
                          Responsibilities:
                        </span>
                      </div>
                      <div className="ml-6">
                        {request.responsibilities.map((resp, index) => (
                          <div
                            key={index}
                            className="text-sm text-gray-900 mb-1"
                          >
                            <span className="font-medium">{resp.role}:</span>{" "}
                            {resp.person}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs font-medium">
                  {request.pending ? (
                    <span className="text-amber-600">Pending</span>
                  ) : request.status === "Approved" ? (
                    <span className="text-green-600">Approved</span>
                  ) : (
                    <span className="text-red-600">Rejected</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}