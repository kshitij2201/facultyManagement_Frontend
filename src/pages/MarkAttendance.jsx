import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import axios from "axios";

// Axios instance for attendance API
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios instance for student API
const studentApi = axios.create({
  baseURL: "https://backend-smp.vercel.app/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function AttendanceLogSystem() {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // State for current date range
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // State for filters
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    fetchLogs();

    // Set up interval for auto-refresh if enabled
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(fetchLogs, 30000); // Refresh every 30 seconds
    }

    // Clean up interval on unmount or when autoRefresh changes
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh]);

  const fetchLogs = async () => {
    try {
      setLoading(true);

      // Fetch student data
      const studentResponse = await studentApi.get("/students");
      const students = studentResponse.data;

      // Fetch existing attendance logs
      const attendanceResponse = await api.get("/attendance");
      let attendanceLogs = attendanceResponse.data;

      // Get current date for attendance
      const currentDate = new Date().toISOString().split("T")[0];

      // Ensure attendance records exist for all students for the current date
      const updatedLogs = await Promise.all(
        students.map(async (student) => {
          const studentId = student.id || student._id;
          const studentName = student.name || "Unknown";
          const studentDept = student.department || student.stream || "General";

          const existingLog = attendanceLogs.find(
            (log) => log.employeeId === studentId && log.date === currentDate
          );

          if (!existingLog) {
            // Create new attendance record if none exists for today
            const newLog = {
              employeeId: studentId,
              name: studentName,
              department: studentDept,
              date: currentDate,
              status: "absent", // Default status
            };

            try {
              const response = await api.post("/attendance", newLog);
              return response.data;
            } catch (postError) {
              console.error(
                `Failed to create attendance for ${studentName} (${studentId}):`,
                postError.message
              );
              return newLog; // Fallback to local data
            }
          }
          return existingLog;
        })
      );

      // Combine existing logs with new/updated logs
      const allLogs = [
        ...attendanceLogs.filter((log) => log.date !== currentDate),
        ...updatedLogs,
      ];

      setAttendanceLogs(allLogs);
      setError(null);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching data:", error.message, error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    fetchLogs();
  };

  const updateStatus = async (logId, status) => {
    if (!logId) {
      console.error("Error: logId is undefined");
      return;
    }

    setUpdatingStatus((prev) => ({ ...prev, [logId]: true }));

    try {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];

      const updateData = {
        status,
        date: currentDate,
      };

      await api.put(`/attendance/${logId}`, updateData);
      await fetchLogs();
      console.log(`Status updated successfully to ${status}`);
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response?.data || error.message
      );
      alert(
        `Failed to update status: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [logId]: false }));
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const departments = useMemo(
    () => [
      ...new Set(
        attendanceLogs.map((log) => log.department?.toString() || "Unknown")
      ),
    ],
    [attendanceLogs]
  );

  const employees = useMemo(
    () => [
      ...new Set(
        attendanceLogs.map((log) => log.name?.toString() || "Unknown")
      ),
    ],
    [attendanceLogs]
  );

  const filteredLogs = useMemo(() => {
    return attendanceLogs.filter((log) => {
      const matchesEmployee = !employeeFilter || log.name === employeeFilter;
      const matchesDepartment =
        !departmentFilter || log.department === departmentFilter;
      const matchesStatus =
        statusFilter === "all" || log.status === statusFilter;
      const matchesDate = !dateFilter || log.date === dateFilter;

      return (
        matchesEmployee && matchesDepartment && matchesStatus && matchesDate
      );
    });
  }, [
    attendanceLogs,
    employeeFilter,
    departmentFilter,
    statusFilter,
    dateFilter,
  ]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const navigateMonth = (direction) => {
    let newMonth = selectedMonth;
    let newYear = selectedYear;

    if (direction === "prev") {
      if (selectedMonth === 0) {
        newMonth = 11;
        newYear = selectedYear - 1;
      } else {
        newMonth = selectedMonth - 1;
      }
    } else {
      if (selectedMonth === 11) {
        newMonth = 0;
        newYear = selectedYear + 1;
      } else {
        newMonth = selectedMonth + 1;
      }
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setCurrentPage(1);
  };

  const formatMonthYear = (month, year) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[month]} ${year}`;
  };

  const exportToCSV = async () => {
    try {
      const response = await api.get("/attendance/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `attendance_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error.message, error);
      alert("Failed to export data. Please try again.");
    }
  };

  if (loading && attendanceLogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={handleManualRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Attendance Log System
        </h1>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-lg font-medium">
            {formatMonthYear(selectedMonth, selectedYear)}
          </span>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-xl font-semibold">
                {filteredLogs.filter((log) => log.status === "present").length}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-xl font-semibold">
                {filteredLogs.filter((log) => log.status === "late").length}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <XCircle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-xl font-semibold">
                {filteredLogs.filter((log) => log.status === "absent").length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center mb-4">
            <Filter size={20} className="text-gray-500 mr-2" />
            <h2 className="text-lg font-medium">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={employeeFilter}
                onChange={(e) => {
                  setEmployeeFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={`emp-${emp}`} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={`dept-${dept}`} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-grow p-2 border rounded-md"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {dateFilter && (
                  <button
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                    onClick={() => setDateFilter("")}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Log Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-lg font-medium flex items-center">
              <FileText size={20} className="mr-2" />
              Attendance Records
            </h2>

            <div className="flex items-center gap-4 flex-wrap">
              <select
                className="p-2 border rounded-md"
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>

              <div className="flex items-center gap-2">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={autoRefresh}
                      onChange={() => setAutoRefresh(!autoRefresh)}
                    />
                    <div
                      className={`block w-14 h-8 rounded-full ${
                        autoRefresh ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                        autoRefresh ? "transform translate-x-6" : ""
                      }`}
                    ></div>
                  </div>
                  <div className="ml-3 text-sm font-medium text-gray-700">
                    Auto-refresh
                  </div>
                </label>
              </div>

              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}

              <button
                className="p-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700"
                onClick={exportToCSV}
              >
                <Download size={18} className="mr-1" />
                Export
              </button>
            </div>
          </div>

          {/* Desktop view */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentLogs.length > 0 ? (
                  currentLogs.map((log) => (
                    <tr key={log.id || log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.name || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.employeeId || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.department || "General"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            log.status === "present"
                              ? "bg-green-100 text-green-800"
                              : log.status === "absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {log.status === "present"
                            ? "Present"
                            : log.status === "absent"
                            ? "Absent"
                            : "Late"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateStatus(log.id || log._id, "present")
                            }
                            disabled={updatingStatus[log.id || log._id]}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              log.status === "present"
                                ? "bg-green-500 text-white"
                                : "bg-green-100 text-green-800 hover:bg-green-200"
                            } ${
                              updatingStatus[log.id || log._id]
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {updatingStatus[log.id || log._id]
                              ? "Updating..."
                              : "Present"}
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(log.id || log._id, "absent")
                            }
                            disabled={updatingStatus[log.id || log._id]}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              log.status === "absent"
                                ? "bg-red-500 text-white"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            } ${
                              updatingStatus[log.id || log._id]
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {updatingStatus[log.id || log._id]
                              ? "Updating..."
                              : "Absent"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="md:hidden">
            {currentLogs.length > 0 ? (
              currentLogs.map((log) => (
                <div key={log.id || log._id} className="p-4 border-b">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">{log.name || "Unknown"}</div>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        log.status === "present"
                          ? "bg-green-100 text-green-800"
                          : log.status === "absent"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {log.status === "present"
                        ? "Present"
                        : log.status === "absent"
                        ? "Absent"
                        : "Late"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {log.employeeId || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {log.department || "General"}
                  </div>
                  <div className="text-sm text-gray-500">Date: {log.date}</div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() =>
                          updateStatus(log.id || log._id, "present")
                        }
                        disabled={updatingStatus[log.id || log._id]}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          log.status === "present"
                            ? "bg-green-500 text-white"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        } ${
                          updatingStatus[log.id || log._id]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {updatingStatus[log.id || log._id]
                          ? "Updating..."
                          : "Present"}
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(log.id || log._id, "absent")
                        }
                        disabled={updatingStatus[log.id || log._id]}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          log.status === "absent"
                            ? "bg-red-500 text-white"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        } ${
                          updatingStatus[log.id || log._id]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {updatingStatus[log.id || log._id]
                          ? "Updating..."
                          : "Absent"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No attendance records found
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredLogs.length > entriesPerPage && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstEntry + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {indexOfLastEntry > filteredLogs.length
                        ? filteredLogs.length
                        : indexOfLastEntry}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredLogs.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() =>
                        paginate(currentPage > 1 ? currentPage - 1 : 1)
                      }
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({
                      length: Math.ceil(filteredLogs.length / entriesPerPage),
                    }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === index + 1
                            ? "bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        } text-sm font-medium`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        paginate(
                          currentPage <
                            Math.ceil(filteredLogs.length / entriesPerPage)
                            ? currentPage + 1
                            : currentPage
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(filteredLogs.length / entriesPerPage)
                      }
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage ===
                        Math.ceil(filteredLogs.length / entriesPerPage)
                          ? "text-gray-300"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </nav>
                </div>
              </div>

              {/* Mobile pagination */}
              <button
                onClick={() =>
                  paginate(
                    currentPage <
                      Math.ceil(filteredLogs.length / entriesPerPage)
                      ? currentPage + 1
                      : currentPage
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(filteredLogs.length / entriesPerPage)
                }
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage ===
                  Math.ceil(filteredLogs.length / entriesPerPage)
                    ? "text-gray-300 bg-gray-50"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
