import { useState, useEffect } from "react";
import {
  Search,
  User,
  ChevronDown,
  ChevronUp,
  Clock,
  BookOpen,
  Briefcase,
  UserCheck,
  Clipboard,
  X,
  Award,
  Trash2,
} from "lucide-react";

export default function DepartmentFaculty({ userData }) {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [expandedFaculty, setExpandedFaculty] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("assign"); // "assign" or "details"
  const [userDepartment, setUserDepartment] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [assignSuccess, setAssignSuccess] = useState(null);
  const [ccAssignments, setCCAssignments] = useState([]);

  const academicYears = ["2023-2024", "2024-2025", "2025-2026"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const sections = ["A", "B", "C", "D"];

  const normalizeDepartment = (dept) =>
    dept ? dept.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : "";

  useEffect(() => {
    console.log("[DepartmentFaculty] userData:", userData);
    const fetchFaculties = async () => {
      try {
        setLoading(true);
        setError(null);

        const department = normalizeDepartment(userData?.department);
        setUserDepartment(department);

        const response = await fetch(
          `http://localhost:5000/api/faculty/faculties?department=${encodeURIComponent(
            department
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch faculty data");
        }
        const data = await response.json();
        console.log("[FacultyFetch] API response:", data);

        const facultiesData = Array.isArray(data.data?.faculties)
          ? data.data.faculties
          : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        setFaculties(facultiesData);
        setFilterDepartment(department);
      } catch (err) {
        setError(err.message);
        console.error("[FacultyFetch] Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCCAssignments = async () => {
      try {
        const department = normalizeDepartment(userData?.department);
        console.log(
          "[CCAssignmentsFetch] Fetching for department:",
          department
        );
        const response = await fetch(
          `http://localhost:5000/api/faculty/cc-assignments?department=${encodeURIComponent(
            department
          )}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("[CCAssignmentsFetch] Raw API response:", data);
        const assignments = Array.isArray(data.data) ? data.data : [];
        console.log("[CCAssignmentsFetch] Processed assignments:", assignments);
        setCCAssignments(assignments);
      } catch (err) {
        console.error("[CCAssignmentsFetch] Error:", err);
      }
    };

    fetchFaculties();
    fetchCCAssignments();
  }, [userData?.department]);

  useEffect(() => {
    console.log("[CCAssignmentsState] Current ccAssignments:", ccAssignments);
  }, [ccAssignments]);

  const departments = [
    ...new Set(faculties.map((faculty) => faculty.department).filter(Boolean)),
  ];

  const filteredFaculties = faculties.filter((faculty) => {
    const matchesSearch =
      faculty.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || faculty.type === filterType;
    const matchesDepartment =
      filterDepartment === "all" || faculty.department === filterDepartment;

    return matchesSearch && matchesType && matchesDepartment;
  });

  const sortedFaculties = [...filteredFaculties].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = (a.firstName || "").localeCompare(b.firstName || "");
    } else if (sortBy === "department") {
      comparison = (a.department || "").localeCompare(b.department || "");
    } else if (sortBy === "dateOfJoining") {
      comparison =
        new Date(a.dateOfJoining || 0) - new Date(b.dateOfJoining || 0);
    } else if (sortBy === "experience") {
      comparison = (a.teachingExperience || 0) - (b.teachingExperience || 0);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleExpandFaculty = (facultyId) => {
    setExpandedFaculty((prev) => (prev === facultyId ? null : facultyId));
  };

  const handleViewDetails = (faculty) => {
    setSelectedFaculty(faculty);
    setModalMode("details");
    setShowModal(true);
    setAssignSuccess(null);
  };

  const handleAssignCCClick = (faculty) => {
    setSelectedFaculty(faculty);
    setModalMode("assign");
    setSelectedYear("");
    setSelectedSemester("");
    setSelectedSection("");
    setAssignSuccess(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFaculty(null);
    setSelectedYear("");
    setSelectedSemester("");
    setSelectedSection("");
    setAssignSuccess(null);
    setModalMode("assign");
  };

  const handleAssignCC = async () => {
    if (!selectedYear || !selectedSemester || !selectedSection) {
      setAssignSuccess("Please select academic year, semester, and section.");
      return;
    }

    try {
      const department = normalizeDepartment(selectedFaculty.department);
      console.log("[AssignCC] Sending department:", department);
      const response = await fetch(
        "http://localhost:5000/api/faculty/assign-cc",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            facultyId: selectedFaculty._id,
            academicYear: selectedYear,
            semester: selectedSemester,
            section: selectedSection,
            department,
            updateType: "cc",
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to assign Course Coordinator"
        );
      }

      console.log("[AssignCC] Success response:", responseData);
      setAssignSuccess(
        `${selectedFaculty.firstName} assigned as Course Coordinator for ${selectedYear}, Semester ${selectedSemester}, Section ${selectedSection}.`
      );

      const updatedAssignmentsResponse = await fetch(
        `http://localhost:5000/api/faculty/cc-assignments?department=${encodeURIComponent(
          department
        )}`
      );
      if (updatedAssignmentsResponse.ok) {
        const updatedData = await updatedAssignmentsResponse.json();
        const assignments = Array.isArray(updatedData.data)
          ? updatedData.data
          : [];
        console.log("[AssignCC] Updated assignments:", assignments);
        setCCAssignments(assignments);
      }

      setTimeout(closeModal, 2000);
    } catch (err) {
      setAssignSuccess(`Error: ${err.message}`);
      console.error("[AssignCC] Error:", err);
    }
  };

  const handleDeleteCC = async (assignment) => {
    if (
      !window.confirm(
        `Remove ${assignment.name} as CC for ${assignment.academicYear}, Semester ${assignment.semester}, Section ${assignment.section}?`
      )
    ) {
      return;
    }

    try {
      const department = normalizeDepartment(assignment.department);
      const response = await fetch(
        "http://localhost:5000/api/faculty/delete-cc-assignment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            facultyId: assignment.facultyId,
            academicYear: assignment.academicYear,
            semester: assignment.semester,
            section: assignment.section,
            department,
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to delete CC assignment"
        );
      }

      console.log("[DeleteCC] Success response:", responseData);
      const updatedAssignmentsResponse = await fetch(
        `http://localhost:5000/api/faculty/cc-assignments?department=${encodeURIComponent(
          department
        )}`
      );
      if (updatedAssignmentsResponse.ok) {
        const updatedData = await updatedAssignmentsResponse.json();
        const assignments = Array.isArray(updatedData.data)
          ? updatedData.data
          : [];
        console.log("[DeleteCC] Updated assignments:", assignments);
        setCCAssignments(assignments);
      }
    } catch (err) {
      console.error("[DeleteCC] Error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const getCurrentCC = (year, semester, section) => {
    return ccAssignments.find(
      (cc) =>
        cc.academicYear === year &&
        cc.semester === semester &&
        cc.section === section &&
        cc.department === normalizeDepartment(userDepartment)
    );
  };

  const isCCAssigned = (semester, section, academicYear) => {
    const isAssigned = ccAssignments.some(
      (assignment) =>
        assignment.semester === semester &&
        assignment.section === section &&
        assignment.academicYear === academicYear &&
        assignment.department === normalizeDepartment(userDepartment)
    );
    console.log("[isCCAssigned] Checking:", {
      semester,
      section,
      academicYear,
      userDepartment,
      isAssigned,
    });
    return isAssigned;
  };

  const formatField = (value, isDate = false) => {
    if (value === null || value === undefined || value === "") return "N/A";
    if (isDate && value) return new Date(value).toLocaleDateString();
    if (Array.isArray(value)) return value.length ? value.join(", ") : "None";
    return value.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-md">
        <p className="text-lg font-semibold">
          Error loading faculty data: {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <BookOpen size={32} className="text-indigo-600" />
          {userDepartment ? `${userDepartment} Faculty` : "Faculty Dashboard"}
        </h1>

        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award size={24} className="text-indigo-600" />
            Assigned Course Coordinators
          </h2>
          {ccAssignments.length === 0 ? (
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <p className="text-gray-600">
                No Course Coordinators assigned yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ccAssignments.map((assignment) => (
                <div
                  key={`${assignment.facultyId}-${assignment.academicYear}-${assignment.semester}-${assignment.section}`}
                  className="bg-indigo-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <User className="h-6 w-6 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {assignment.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDeleteCC(assignment)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Year:</span>{" "}
                    {assignment.academicYear}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Semester:</span>{" "}
                    {assignment.semester}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Section:</span>{" "}
                    {assignment.section}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Department:</span>{" "}
                    {assignment.department}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">Assigned:</span>{" "}
                    {new Date(assignment.assignedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-6 mb-8 bg-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div className="relative flex-1 min-w-[250px]">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, email or ID"
              className="border border-gray-300 p-3 pl-12 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Types</option>
            <option value="teaching">Teaching</option>
            <option value="non-teaching">Non-Teaching</option>
            <option value="hod">HOD</option>
            <option value="principal">Principal</option>
          </select>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            disabled={!!userDepartment}
            className="border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split("-");
              setSortBy(by);
              setSortOrder(order);
            }}
            className="border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="department-asc">Department (A-Z)</option>
            <option value="department-desc">Department (Z-A)</option>
            <option value="dateOfJoining-asc">Joining Date (Oldest)</option>
            <option value="dateOfJoining-desc">Joining Date (Newest)</option>
            <option value="experience-asc">Experience (Low to High)</option>
            <option value="experience-desc">Experience (High to Low)</option>
          </select>
        </div>

        {sortedFaculties.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-lg animate-fade-in">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-3 text-xl font-semibold text-gray-900">
              No faculty found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm
                ? "No faculty match your search criteria"
                : "No faculty available in this department"}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden animate-fade-in">
            <ul className="divide-y divide-gray-200">
              {sortedFaculties.map((faculty) => (
                <li
                  key={faculty._id}
                  className="px-6 py-6 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-lg font-semibold text-gray-900">
                          {faculty.firstName} {faculty.lastName || ""}
                        </div>
                        <div className="text-sm text-gray-500">
                          {faculty.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800 font-medium">
                        {faculty.department}
                      </span>
                      <button
                        onClick={() => handleAssignCCClick(faculty)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-md"
                      >
                        Assign/Change CC
                      </button>
                      <button
                        onClick={() => handleExpandFaculty(faculty._id)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                      >
                        {expandedFaculty === faculty._id ? (
                          <ChevronUp className="h-6 w-6" />
                        ) : (
                          <ChevronDown className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                  </div>
                  {expandedFaculty === faculty._id && (
                    <div className="mt-6 ml-16 bg-indigo-50 p-6 rounded-xl animate-slide-down">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Clipboard size={18} className="text-indigo-600" />
                          <div>
                            <p className="text-gray-500">Employee ID</p>
                            <p className="font-medium">{faculty.employeeId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck size={18} className="text-indigo-600" />
                          <div>
                            <p className="text-gray-500">Type</p>
                            <p className="font-medium capitalize">
                              {faculty.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-indigo-600" />
                          <div>
                            <p className="text-gray-500">Date of Joining</p>
                            <p className="font-medium">
                              {new Date(
                                faculty.dateOfJoining
                              ).toLocaleDateString() || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase size={18} className="text-indigo-600" />
                          <div>
                            <p className="text-gray-500">Experience</p>
                            <p className="font-medium">
                              {faculty.teachingExperience || 0} years
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => handleViewDetails(faculty)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-md"
                        >
                          View Full Details
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showModal && selectedFaculty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {modalMode === "details" ? (
                      <>
                        <User size={24} className="text-indigo-600" />
                        Faculty Details
                      </>
                    ) : (
                      <>
                        <Award size={24} className="text-indigo-600" />
                        {isCCAssigned(
                          selectedSemester,
                          selectedSection,
                          selectedYear
                        )
                          ? "Change Course Coordinator"
                          : "Assign Course Coordinator"}
                      </>
                    )}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="px-8 py-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-shrink-0 h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-10 w-10 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">
                      {selectedFaculty.title || ""} {selectedFaculty.firstName}{" "}
                      {selectedFaculty.middleName || ""}{" "}
                      {selectedFaculty.lastName || ""}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {selectedFaculty.email}
                    </p>
                  </div>
                </div>

                {modalMode === "details" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Employee ID</p>
                      <p>{formatField(selectedFaculty.employeeId)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Gender</p>
                      <p>{formatField(selectedFaculty.gender)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Designation</p>
                      <p>{formatField(selectedFaculty.designation)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Mobile</p>
                      <p>{formatField(selectedFaculty.mobile)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Date of Birth</p>
                      <p>{formatField(selectedFaculty.dateOfBirth, true)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Date of Joining
                      </p>
                      <p>{formatField(selectedFaculty.dateOfJoining, true)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Department</p>
                      <p>{formatField(selectedFaculty.department)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Address</p>
                      <p>{formatField(selectedFaculty.address)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Aadhaar</p>
                      <p>{formatField(selectedFaculty.aadhaar)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Employment Type
                      </p>
                      <p>{formatField(selectedFaculty.employmentType)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Status</p>
                      <p>{formatField(selectedFaculty.status)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Faculty Type</p>
                      <p>{formatField(selectedFaculty.type)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Role</p>
                      <p>{formatField(selectedFaculty.role)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Teaching Experience
                      </p>
                      <p>
                        {formatField(selectedFaculty.teachingExperience)} years
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Subjects Taught
                      </p>
                      <p>{formatField(selectedFaculty.subjectsTaught)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Technical Skills
                      </p>
                      <p>{formatField(selectedFaculty.technicalSkills)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Father's Name</p>
                      <p>{formatField(selectedFaculty.fathersName)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">RFID No</p>
                      <p>{formatField(selectedFaculty.rfidNo)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Sevarth No</p>
                      <p>{formatField(selectedFaculty.sevarthNo)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Personal Email
                      </p>
                      <p>{formatField(selectedFaculty.personalEmail)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Communication Email
                      </p>
                      <p>{formatField(selectedFaculty.communicationEmail)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Spouse Name</p>
                      <p>{formatField(selectedFaculty.spouseName)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Date of Increment
                      </p>
                      <p>
                        {formatField(selectedFaculty.dateOfIncrement, true)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Date of Retirement
                      </p>
                      <p>
                        {formatField(selectedFaculty.dateOfRetirement, true)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Relieving Date
                      </p>
                      <p>{formatField(selectedFaculty.relievingDate, true)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Pay Revised Date
                      </p>
                      <p>{formatField(selectedFaculty.payRevisedDate, true)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Transport Allowance
                      </p>
                      <p>{formatField(selectedFaculty.transportAllowance)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Handicap</p>
                      <p>{formatField(selectedFaculty.handicap)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Senior Citizen
                      </p>
                      <p>{formatField(selectedFaculty.seniorCitizen)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">HRA</p>
                      <p>{formatField(selectedFaculty.hra)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Quarter</p>
                      <p>{formatField(selectedFaculty.quarter)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Bank Name</p>
                      <p>{formatField(selectedFaculty.bankName)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">PAN Number</p>
                      <p>{formatField(selectedFaculty.panNumber)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Mother Tongue</p>
                      <p>{formatField(selectedFaculty.motherTongue)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Designation Nature
                      </p>
                      <p>{formatField(selectedFaculty.designationNature)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">PF</p>
                      <p>{formatField(selectedFaculty.pf)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">PF Number</p>
                      <p>{formatField(selectedFaculty.pfNumber)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">NPS Number</p>
                      <p>{formatField(selectedFaculty.npsNumber)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">
                        Bank Branch Name
                      </p>
                      <p>{formatField(selectedFaculty.bankBranchName)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">UAN Number</p>
                      <p>{formatField(selectedFaculty.uanNumber)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">IFSC Code</p>
                      <p>{formatField(selectedFaculty.ifscCode)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">ESIC Number</p>
                      <p>{formatField(selectedFaculty.esicNumber)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">PF Applicable</p>
                      <p>{formatField(selectedFaculty.pfApplicable)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedYear &&
                      selectedSemester &&
                      selectedSection &&
                      isCCAssigned(
                        selectedSemester,
                        selectedSection,
                        selectedYear
                      ) && (
                        <div className="mb-4 p-4 bg-yellow-100 rounded-lg">
                          <p className="text-sm text-yellow-700">
                            Current CC:{" "}
                            {getCurrentCC(
                              selectedYear,
                              selectedSemester,
                              selectedSection
                            )?.name || "Unknown"}{" "}
                            is assigned. Assigning a new CC will replace this.
                          </p>
                        </div>
                      )}
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Academic Year</option>
                      {academicYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Section</option>
                      {sections.map((sec) => (
                        <option key={sec} value={sec}>
                          Section {sec}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignCC}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                    >
                      {isCCAssigned(
                        selectedSemester,
                        selectedSection,
                        selectedYear
                      )
                        ? "Change Course Coordinator"
                        : "Assign Course Coordinator"}
                    </button>
                    {assignSuccess && (
                      <p
                        className={`text-sm ${
                          assignSuccess.includes("Error")
                            ? "text-red-600"
                            : "text-green-600"
                        } animate-fade-in`}
                      >
                        {assignSuccess}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="px-8 py-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
