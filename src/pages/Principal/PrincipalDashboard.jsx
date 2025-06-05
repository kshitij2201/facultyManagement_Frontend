import React, { useState } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Bar,
  Cell,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Search } from "lucide-react";

export default function CollegeAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("Semester");

  // KPI Data
  const enrollmentData = {
    value: "4,820",
    change: "+5.32%",
    details: [
      { label: "Undergraduate programs", value: "+215" },
      { label: "Graduate programs", value: "+78" },
      { label: "Certificate programs", value: "+42" },
    ],
  };

  const retentionRatesData = {
    value: "87.5%",
    change: "+2.8%",
    details: [
      { label: "First-year retention", value: "+3.2%" },
      { label: "Sophomore to junior", value: "+2.7%" },
      { label: "Junior to senior", value: "+1.9%" },
    ],
  };

  const graduationRatesData = {
    value: "76.2%",
    change: "+4.5%",
    details: [
      { label: "4-year graduation", value: "+3.8%" },
      { label: "5-year graduation", value: "+5.1%" },
      { label: "6-year graduation", value: "+4.2%" },
    ],
  };

  const financialData = {
    value: "$28.4M",
    change: "+6.7%",
    details: [
      { label: "Tuition revenue", value: "+$1.2M" },
      { label: "Research grants", value: "+$780K" },
      { label: "Alumni donations", value: "+$340K" },
    ],
  };

  // Chart data
  const semesterDataPoints = [
    { name: "Fall '22", value: 82 },
    { name: "Spring '23", value: 78 },
    { name: "Summer '23", value: 45 },
    { name: "Fall '23", value: 88 },
    { name: "Spring '24", value: 84 },
    { name: "Summer '24", value: 52 },
    { name: "Fall '24", value: 92 },
    { name: "Spring '25", value: 89 },
  ];

  const majorDistributionData = [
    { name: "Business", value: 28, fill: "#6366F1" },
    { name: "Computer Science", value: 22, fill: "#8b5cf6" },
    { name: "Engineering", value: 18, fill: "#c084fc" },
    { name: "Health Sciences", value: 14, fill: "#d8b4fe" },
    { name: "Liberal Arts", value: 12, fill: "#e9d5ff" },
    { name: "Other", value: 6, fill: "#f3e8ff" },
  ];

  const studentSuccessData = [
    { name: "Course Completion", value: 92, fill: "#6366F1" },
    { name: "Average GPA", value: 78, fill: "#8b5cf6" },
    { name: "Career Placement", value: 85, fill: "#c084fc" },
    { name: "Student Satisfaction", value: 76, fill: "#d8b4fe" },
  ];

  const financialTrendsData = [
    { name: "2022 Q3", Current: 24, Previous: 20 },
    { name: "2022 Q4", Current: 26, Previous: 22 },
    { name: "2023 Q1", Current: 25, Previous: 21 },
    { name: "2023 Q2", Current: 28, Previous: 23 },
    { name: "2023 Q3", Current: 27, Previous: 24 },
    { name: "2023 Q4", Current: 29, Previous: 25 },
    { name: "2024 Q1", Current: 30, Previous: 26 },
    { name: "2024 Q2", Current: 32, Previous: 27 },
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow rounded border border-gray-200">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-indigo-600">{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              College Analytics
            </h1>
            <p className="text-sm text-gray-500">
              KPI analysis for college performance
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white rounded-md border border-gray-200 p-1">
              <button
                className={`px-4 py-1 rounded-md text-sm ${
                  activeTab === "Year"
                    ? "bg-indigo-100 text-indigo-800"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("Year")}
              >
                Year
              </button>
              <button
                className={`px-4 py-1 rounded-md text-sm ${
                  activeTab === "Quarter"
                    ? "bg-indigo-100 text-indigo-800"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("Quarter")}
              >
                Quarter
              </button>
              <button
                className={`px-4 py-1 rounded-md text-sm ${
                  activeTab === "Semester"
                    ? "bg-indigo-100 text-indigo-800"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("Semester")}
              >
                Semester
              </button>
            </div>

            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-md border border-gray-200">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">20 May, 2025</span>
            </div>

            <div className="bg-white p-2 rounded-md border border-gray-200">
              <Search size={18} className="text-gray-500" />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Enrollment */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Student Enrollment
              </h3>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold">{enrollmentData.value}</p>
                <span className="text-sm font-medium text-green-600">
                  {enrollmentData.change}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {enrollmentData.details.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-green-600 font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Retention Rates */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Retention Rates
              </h3>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold">{retentionRatesData.value}</p>
                <span className="text-sm font-medium text-green-600">
                  {retentionRatesData.change}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {retentionRatesData.details.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-green-600 font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Graduation Rates */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Graduation Rates
              </h3>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold">
                  {graduationRatesData.value}
                </p>
                <span className="text-sm font-medium text-green-600">
                  {graduationRatesData.change}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {graduationRatesData.details.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-green-600 font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Performance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500">
                Financial Performance
              </h3>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold">{financialData.value}</p>
                <span className="text-sm font-medium text-green-600">
                  {financialData.change}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {financialData.details.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="text-green-600 font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Semester Data Chart - Takes 2/3 width */}
          <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Enrollment Trends
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={semesterDataPoints}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart - Takes 1/3 width */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Major Distribution
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={majorDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {majorDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4">
              {majorDistributionData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm mb-2"
                >
                  <div className="flex items-center">
                    <div
                      style={{ backgroundColor: item.fill }}
                      className="w-3 h-3 rounded-full mr-2"
                    ></div>
                    <span className="text-gray-800">{item.name}</span>
                  </div>
                  <div className="text-gray-600">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row of Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Student Success Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Student Success Metrics
              </h3>
              <div className="flex space-x-2 text-sm">
                <span className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mr-1"></div>
                  Current
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div>
                  Target
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {studentSuccessData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-900">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Trends Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Financial Trends (in millions)
              </h3>
              <div className="flex space-x-2 text-sm">
                <span className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mr-1"></div>
                  Current
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-200 mr-1"></div>
                  Previous
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialTrendsData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="Current" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="Previous"
                    fill="#E0E7FF"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
