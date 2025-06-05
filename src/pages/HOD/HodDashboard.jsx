import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Sample data for demonstration
const staffData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    position: "Associate Professor",
    subject: "Computer Science",
    email: "sarah.j@university.edu",
    phone: "+1-555-123-4567",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    position: "Assistant Professor",
    subject: "Software Engineering",
    email: "m.chen@university.edu",
    phone: "+1-555-234-5678",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    position: "Professor",
    subject: "Data Science",
    email: "e.rodriguez@university.edu",
    phone: "+1-555-345-6789",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    position: "Lecturer",
    subject: "Artificial Intelligence",
    email: "j.wilson@university.edu",
    phone: "+1-555-456-7890",
  },
  {
    id: 5,
    name: "Prof. Aisha Patel",
    position: "Associate Professor",
    subject: "Cybersecurity",
    email: "a.patel@university.edu",
    phone: "+1-555-567-8901",
  },
];

const attendanceData = [
  { month: "Jan", CS101: 92, SE201: 88, DS301: 85, AI401: 78 },
  { month: "Feb", CS101: 88, SE201: 85, DS301: 82, AI401: 80 },
  { month: "Mar", CS101: 90, SE201: 87, DS301: 88, AI401: 82 },
  { month: "Apr", CS101: 85, SE201: 83, DS301: 80, AI401: 75 },
  { month: "May", CS101: 82, SE201: 80, DS301: 78, AI401: 73 },
];

const feesData = [
  { month: "Jan", collected: 85000, pending: 15000 },
  { month: "Feb", collected: 92000, pending: 12000 },
  { month: "Mar", collected: 78000, pending: 18000 },
  { month: "Apr", collected: 89000, pending: 14000 },
  { month: "May", collected: 94000, pending: 10000 },
];

const feesStatusData = [
  { name: "Paid", value: 78 },
  { name: "Partially Paid", value: 15 },
  { name: "Unpaid", value: 7 },
];

const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

// Summary metrics
const summaryMetrics = [
  { title: "Total Students", value: "1,247", trend: "up", change: "+3.2%" },
  { title: "Average Attendance", value: "83%", trend: "down", change: "-1.7%" },
  { title: "Total Revenue", value: "$438,000", trend: "up", change: "+5.6%" },
  { title: "Faculty Members", value: "32", trend: "same", change: "0%" },
];

export default function AcademicDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      {/* <div className="w-full p-6 text-white">
        <h1 className="text-4xl font-bold text-black">ANALYTICS</h1>
      </div> */}

      {/* Summary Metrics */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                {metric.title}
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-3xl font-bold text-gray-800">
                  {metric.value}
                </p>
                <span
                  className={`text-sm ${
                    metric.trend === "up"
                      ? "text-green-500"
                      : metric.trend === "down"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Widgets Section */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-6">WIDGETS</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Widget 1: Student Fees - Trend Widget */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 font-medium mb-4">
              STUDENT FEES - TREND WIDGET
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Bar
                    dataKey="collected"
                    name="Collected"
                    fill="#4CAF50"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Widget 2: Attendance - Trend Widget 2 Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 font-medium mb-4">
              ATTENDANCE - TREND WIDGET 2 METRICS
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Bar
                    dataKey="collected"
                    name="Collected"
                    fill="#4B0082" // Indigo color
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Widget 3: Cost Per Student - Gauge Widget */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 font-medium mb-4">
              COST PER STUDENT (CPS) - GAUGE WIDGET
            </h3>
            <div className="h-48 flex justify-center items-center">
              <div className="relative w-32 h-32">
                {/* Gauge Background */}
                <div
                  className="absolute w-full h-full rounded-full bg-gradient-to-r from-green-300 via-yellow-300 to-red-300"
                  style={{
                    clipPath: "polygon(50% 50%, 0% 0%, 100% 0%, 100% 50%)",
                  }}
                ></div>

                {/* Gauge Needle */}
                <div className="absolute top-0 left-0 w-full h-full flex justify-center">
                  <div className="w-1 h-16 bg-gray-800 origin-bottom transform rotate-45"></div>
                </div>

                {/* Gauge Center & Value */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center">
                  <div className="w-8 h-8 rounded-full bg-white border-4 border-gray-800"></div>
                  <p className="text-xl font-bold mt-16">$3,742</p>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 4: Student Impressions - Historic Widget */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 font-medium mb-4">
              STUDENT IMPRESSIONS - HISTORIC WIDGET
            </h3>
            <div className="text-center pb-4">
              <p className="text-3xl font-bold">35,567</p>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <Line
                    type="monotone"
                    dataKey="CS101"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Widget 5: Total Course Enrollments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 font-medium mb-4">
              TOTAL COURSE ENROLLMENTS
            </h3>
            <div className="text-center pb-4">
              <p className="text-3xl font-bold">252,292</p>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <Bar dataKey="CS101" fill="#10B981" radius={[2, 2, 0, 0]} />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Widget 6: Total Class Visits */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 font-medium mb-4">
              TOTAL CLASS VISITS
            </h3>
            <div className="text-center pb-4">
              <p className="text-3xl font-bold">57,841</p>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <Line
                    type="monotone"
                    dataKey="CS101"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Widget */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-700 font-medium mb-4">
              STUDENT PAYMENT STATUS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feesStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {feesStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {feesStatusData.map((status, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4"
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{status.name}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{status.value}%</p>
                    </div>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t">
                  <div className="flex justify-between">
                    <p className="font-medium">Collection Rate</p>
                    <p className="font-bold text-green-600">87%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
