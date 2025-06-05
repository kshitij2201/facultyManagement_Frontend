import React, { useEffect, useState } from "react";
import {
  LogOut,
  Users,
  BookOpen,
  Calendar,
  Award,
  Activity,
} from "lucide-react";

export default function Dashboard({ userData, onLogout }) {
  const [isLoading, setIsLoading] = useState(true);

  // Sample data for administrative dashboard
  const adminStats = {
    totalFaculty: 42,
    newHires: 5,
    departments: 7,
    pendingApprovals: 3,
    budgetUtilization: 78,
  };

  // Sample data for teaching dashboard
  const teachingStats = {
    totalStudents: 320,
    averageAttendance: 87,
    upcomingClasses: 4,
    assignmentsPending: 12,
    coursesTeaching: 3,
    officeHours: 5,
  };

  // Sample data for non-teaching dashboard
  const nonTeachingStats = {
    totalTasks: 15,
    completedTasks: 10,
    pendingTasks: 5,
    upcomingMeetings: 3,
    supportRequests: 8,
  };

  // Administrative data
  const facultyData = [
    { name: "Computer Science", count: 14 },
    { name: "Information Technology", count: 12 },
    { name: "Electronics", count: 10 },
    { name: "Mechanical", count: 8 },
    { name: "Civil", count: 7 },
    { name: "Electrical", count: 9 },
    { name: "Data Science", count: 11 },
  ];

  // Teaching data
  const attendanceData = [
    { name: "Monday", attendance: 92 },
    { name: "Tuesday", attendance: 88 },
    { name: "Wednesday", attendance: 95 },
    { name: "Thursday", attendance: 85 },
    { name: "Friday", attendance: 78 },
  ];

  // Non-teaching data
  const taskData = [
    { name: "Maintenance", count: 5, completed: 3 },
    { name: "Inventory", count: 4, completed: 4 },
    { name: "Admin Support", count: 3, completed: 2 },
    { name: "Logistics", count: 3, completed: 1 },
  ];

  // Determine which dashboard to show based on role
  const showAdminDashboard = userData?.role === "facultymanagement";
  const showTeachingDashboard =
    userData?.role === "teaching" || userData?.role === "HOD";
  const showNonTeachingDashboard = userData?.role === "non-teaching";

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-600">
            Loading dashboard...
          </p>
          <div className="mt-4 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="w-full p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {userData?.name || userData?.email || "User"}
            </h1>
            <p className="text-gray-600">
              {showAdminDashboard
                ? "Faculty Management Dashboard"
                : showTeachingDashboard
                ? "Teaching Dashboard"
                : showNonTeachingDashboard
                ? "Non-Teaching Dashboard"
                : "Staff Dashboard"}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-md"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        {/* Show appropriate dashboard based on role */}
        {showAdminDashboard ? (
          <div className="space-y-6">
            {/* Admin Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Faculty</p>
                    <p className="text-2xl font-bold">
                      {adminStats.totalFaculty}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">New Hires</p>
                    <p className="text-2xl font-bold">{adminStats.newHires}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users size={24} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Departments</p>
                    <p className="text-2xl font-bold">
                      {adminStats.departments}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <BookOpen size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Pending Approvals</p>
                    <p className="text-2xl font-bold">
                      {adminStats.pendingApprovals}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Award size={24} className="text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Faculty Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Faculty Distribution
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facultyData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{
                          backgroundColor: `hsl(${index * 30}, 70%, 60%)`,
                        }}
                      ></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full">
                        {item.count} Faculty
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-3 border-b border-gray-200">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Activity size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      New faculty joined: Dr. Sarah Johnson
                    </p>
                    <p className="text-gray-500 text-sm">
                      Department of Computer Science
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm ml-auto">2 days ago</p>
                </div>

                <div className="flex items-center gap-4 pb-3 border-b border-gray-200">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Activity size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Faculty evaluation complete: Data Science Dept
                    </p>
                    <p className="text-gray-500 text-sm">
                      11 faculty members evaluated
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm ml-auto">1 week ago</p>
                </div>

                <div className="flex items-center gap-4 pb-3 border-b border-gray-200">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Activity size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Budget approval needed for Electronics Department
                    </p>
                    <p className="text-gray-500 text-sm">
                      ₹2,50,000 equipment request
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm ml-auto">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        ) : showTeachingDashboard ? (
          <div className="space-y-6">
            {/* Teaching Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold">
                      {teachingStats.totalStudents}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Average Attendance</p>
                    <p className="text-2xl font-bold">
                      {teachingStats.averageAttendance}%
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Activity size={24} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Courses Teaching</p>
                    <p className="text-2xl font-bold">
                      {teachingStats.coursesTeaching}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <BookOpen size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Office Hours</p>
                    <p className="text-2xl font-bold">
                      {teachingStats.officeHours} hrs/week
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Calendar size={24} className="text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Attendance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Weekly Attendance</h2>
              <div className="space-y-2">
                {attendanceData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-20 flex-shrink-0 font-medium">
                      {item.name}
                    </div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${item.attendance}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-right ml-2 font-medium text-green-600">
                      {item.attendance}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Classes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      Introduction to Computer Science
                    </p>
                    <p className="text-gray-500 text-sm">
                      Today, 11:00 AM - Room 302
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    45 Students
                  </span>
                </div>

                <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Calendar size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Data Structures & Algorithms</p>
                    <p className="text-gray-500 text-sm">
                      Tomorrow, 9:30 AM - Room 201
                    </p>
                  </div>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    38 Students
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : showNonTeachingDashboard ? (
          <div className="space-y-6">
            {/* Non-Teaching Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Tasks</p>
                    <p className="text-2xl font-bold">
                      {nonTeachingStats.totalTasks}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Completed Tasks</p>
                    <p className="text-2xl font-bold">
                      {nonTeachingStats.completedTasks}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Activity size={24} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Pending Tasks</p>
                    <p className="text-2xl font-bold">
                      {nonTeachingStats.pendingTasks}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Award size={24} className="text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Upcoming Meetings</p>
                    <p className="text-2xl font-bold">
                      {nonTeachingStats.upcomingMeetings}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Calendar size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Task Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Task Overview</h2>
              <div className="space-y-2">
                {taskData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 flex-shrink-0 font-medium">
                      {item.name}
                    </div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${(item.completed / item.count) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="w-20 text-right ml-2 font-medium text-green-600">
                      {item.completed}/{item.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Meetings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Staff Coordination Meeting</p>
                    <p className="text-gray-500 text-sm">
                      Today, 2:00 PM - Conference Room
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    10 Attendees
                  </span>
                </div>

                <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Calendar size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Maintenance Review</p>
                    <p className="text-gray-500 text-sm">
                      Tomorrow, 10:00 AM - Admin Office
                    </p>
                  </div>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    5 Attendees
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg пришли rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Staff Dashboard</h2>
            <p className="text-gray-600">
              Welcome to your dashboard. Please use the sidebar to navigate to
              specific features like profile, payslip, or announcements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
