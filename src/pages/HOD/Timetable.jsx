import { useState, useEffect } from "react";
import axios from "axios";

export default function CourseTimeTable({ userData }) {
  // State for college information
  const [collegeInfo, setCollegeInfo] = useState({
    status:
      'An Autonomous Institution affiliated to Rashtrasant Tukadoji Maharaj Nagpur University, Nagpur and Accredited with Grade "A" by NAAC',
    address: "Nagpur, Maharashtra - 440009",
    department: "",
    year: "Year of Study: 2023-24",
    semester: "I",
    section: "A",
    date: "w.e.f.02/01/2024",
    room: "Room No.: Block-BT/303",
  });

  // State for faculties, subjects, time slots, and timetable
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [mathTeachers, setMathTeachers] = useState([]); // Reintroduced for server compatibility
  const [timeSlots, setTimeSlots] = useState([
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-01:00",
    "01:00-02:00",
    "02:00-03:00",
    "03:00-04:00",
  ]);

  const [timetableData, setTimetableData] = useState([
    {
      day: "Mon",
      classes: Array(7).fill({ subject: "", type: "Theory", faculty: "" }),
    },
    {
      day: "Tue",
      classes: Array(7).fill({ subject: "", type: "Theory", faculty: "" }),
    },
    {
      day: "Wed",
      classes: Array(7).fill({ subject: "", type: "Theory", faculty: "" }),
    },
    {
      day: "Thu",
      classes: Array(7).fill({ subject: "", type: "Theory", faculty: "" }),
    },
    {
      day: "Fri",
      classes: Array(7).fill({ subject: "", type: "Theory", faculty: "" }),
    },
    {
      day: "Sat",
      classes: [
        { subject: "TNP Activity", type: "Activity", faculty: "", colSpan: 7 },
      ],
    },
  ]);

  const [activeDay, setActiveDay] = useState(0);
  const [saveStatus, setSaveStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [timetableId, setTimetableId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [employeeId, setEmployeeId] = useState(null);
  const [department, setDepartment] = useState(null);
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState("");
  const [editingCell, setEditingCell] = useState(null);
  const [newDayName, setNewDayName] = useState("");

  // Constants
  const semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  const sections = ["A", "B", "C", "D"];
  const classTypes = ["Theory", "Lab", "Seminar", "Activity", "Break"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Extract employeeId and department from userData
  useEffect(() => {
    if (userData) {
      const empId = userData.employeeId || "¿";
      setEmployeeId(empId);
      setDepartment(userData.department || "Unknown Department");
      setCollegeInfo((prev) => ({
        ...prev,
        department: userData.department
          ? `DEPARTMENT OF ${userData.department.toUpperCase()}`
          : "DEPARTMENT OF ELECTRONICS & TELECOMMUNICATION ENGINEERING",
      }));
      console.log("Employee ID:", empId, "Department:", userData.department);
    }
  }, [userData]);

  // Fetch faculties
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        if (!department) return;
        const response = await axios.get(
          "http://localhost:5000/api/faculty/faculties",
          { params: { department } }
        );
        const facultyArray =
          response.data?.data?.faculties || response.data?.faculties || [];
        setFaculties(
          Array.isArray(facultyArray) ? facultyArray.map((f) => f.name) : []
        );
        console.log("Faculties fetched:", facultyArray);
      } catch (error) {
        console.error("Error fetching faculties:", error);
        setSaveStatus("Failed to fetch faculties.");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    };
    fetchFaculties();
  }, [department]);

  // Fetch math teachers (assuming server expects this)
  useEffect(() => {
    const fetchMathTeachers = async () => {
      try {
        if (!department) return;
        const response = await axios.get(
          "http://localhost:5000/api/faculty/math-teachers",
          { params: { department } }
        );
        const mathTeachersArray =
          response.data?.data?.faculties || response.data?.faculties || [];
        setMathTeachers(
          Array.isArray(mathTeachersArray)
            ? mathTeachersArray.map((f) => f.name)
            : []
        );
        console.log("Math Teachers fetched:", mathTeachersArray);
      } catch (error) {
        console.error("Error fetching math teachers:", error);
        setMathTeachers(["Default Math Teacher"]); // Fallback
        setSaveStatus("Failed to fetch math teachers. Using default.");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    };
    fetchMathTeachers();
  }, [department]);

  // Fetch initial timetable data
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        if (!employeeId) throw new Error("Employee ID not set");
        const response = await axios.get(
          "http://localhost:5000/api/timetable",
          {
            params: { employeeId },
          }
        );
        console.log("Timetable fetch response:", response.data);
        if (response.data && response.data.length > 0) {
          const timetable = response.data[0];
          setCollegeInfo({
            ...timetable.collegeInfo,
            department: department
              ? `DEPARTMENT OF ${department.toUpperCase()}`
              : timetable.collegeInfo?.department ||
                "DEPARTMENT OF ELECTRONICS & TELECOMMUNICATION ENGINEERING",
            semester: timetable.collegeInfo?.semester || "I",
            section: timetable.collegeInfo?.section || "A",
          });
          setSubjects(timetable.subjects || []);
          setTimetableData(timetable.timetableData || timetableData);
          setTimeSlots(timetable.timeSlots || timeSlots);
          setMathTeachers(timetable.mathTeachers || mathTeachers);
          const cleanId = (timetable._id || timetable.id)?.split(":")[0].trim();
          setTimetableId(cleanId);
          console.log("Timetable ID set:", cleanId);
        } else {
          setSaveStatus("No timetable data available. Using default data.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching timetable:", error);
        setSaveStatus(`Failed to fetch timetable: ${error.message}`);
        setLoading(false);
      }
    };
    if (employeeId) {
      fetchTimetable();
    } else {
      setLoading(false);
    }
  }, [employeeId, department]);

  // Save timetable
  const saveTimetable = async () => {
    try {
      setSaveStatus("Saving...");
      if (!employeeId || employeeId === "¿") {
        throw new Error("Invalid or missing employeeId");
      }
      if (
        !collegeInfo.department ||
        !collegeInfo.semester ||
        !collegeInfo.section
      ) {
        throw new Error("Missing required collegeInfo fields");
      }
      if (!subjects.length) {
        throw new Error("At least one subject is required");
      }
      const token = localStorage.getItem("token") || userData?.token || "";
      console.log("Save Token:", token);
      console.log(
        "Save Request body:",
        JSON.stringify(
          {
            employeeId,
            collegeInfo,
            subjects,
            timetableData,
            timeSlots,
            mathTeachers,
          },
          null,
          2
        )
      );
      const response = await axios.post(
        "http://localhost:5000/api/timetable",
        {
          employeeId,
          collegeInfo,
          subjects,
          timetableData,
          timeSlots,
          mathTeachers,
        },
        {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        }
      );
      console.log("Save response:", response.data);
      const cleanId = (response.data.timetable?._id || response.data._id)
        ?.split(":")[0]
        .trim();
      setTimetableId(cleanId);
      console.log("Timetable ID set:", cleanId);
      setSaveStatus("Timetable saved successfully!");
    } catch (error) {
      console.error("Error saving timetable:", error);
      console.log("Server response:", error.response?.data);
      setSaveStatus(
        `Failed to save timetable: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // Update timetable
  const updateTimetable = async () => {
    if (!timetableId) {
      setSaveStatus("No timetable ID found. Please save first.");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    const cleanTimetableId = timetableId.split(":")[0].trim();
    console.log("Clean Timetable ID:", cleanTimetableId);
    console.log(
      "Update Request body:",
      JSON.stringify(
        {
          employeeId,
          collegeInfo,
          subjects,
          timetableData,
          timeSlots,
          mathTeachers,
        },
        null,
        2
      )
    );
    try {
      setSaveStatus("Updating...");
      if (!employeeId || employeeId === "¿") {
        throw new Error("Invalid or missing employeeId");
      }
      if (
        !collegeInfo.department ||
        !collegeInfo.semester ||
        !collegeInfo.section
      ) {
        throw new Error("Missing required collegeInfo fields");
      }
      if (!subjects.length) {
        throw new Error("At least one subject is required");
      }
      const token = localStorage.getItem("token") || userData?.token || "";
      console.log("Update Token:", token);
      const response = await axios.put(
        `http://localhost:5000/api/timetable/${cleanTimetableId}`,
        {
          employeeId,
          collegeInfo,
          subjects,
          timetableData,
          timeSlots,
          mathTeachers,
        },
        { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );
      console.log("Update response:", response.data);
      const updated = response.data.timetable;
      setCollegeInfo({
        ...updated.collegeInfo,
        department: department
          ? `DEPARTMENT OF ${department.toUpperCase()}`
          : updated.collegeInfo?.department ||
            "DEPARTMENT OF ELECTRONICS & TELECOMMUNICATION ENGINEERING",
      });
      setSubjects(updated.subjects || subjects);
      setTimetableData(updated.timetableData || timetableData);
      setTimeSlots(updated.timeSlots || timeSlots);
      setMathTeachers(updated.mathTeachers || mathTeachers);
      setSaveStatus("Timetable updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating timetable:", error);
      console.log("Server response:", error.response?.data);
      setSaveStatus(
        `Failed to update timetable: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // Add a new subject
  const addSubject = () => {
    setSubjects([
      ...subjects,
      {
        code: `SUB-${subjects.length + 1}`,
        name: `New Subject ${subjects.length + 1}`,
        faculty: faculties[0] || "",
      },
    ]);
    setSaveStatus("Subject added.");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  // Handle cell click to start editing
  const handleCellClick = (dayIndex, classIndex) => {
    if (
      !isEditing ||
      timetableData[dayIndex].classes[classIndex].subject === "RECESS"
    )
      return;
    setEditingCell({ dayIndex, classIndex });
  };

  // Update cell data
  const updateCellData = (field, value) => {
    if (!editingCell) return;
    const { dayIndex, classIndex } = editingCell;
    const newTimetable = [...timetableData];
    if (field === "subject") {
      const subjectObj = subjects.find((sub) => sub.name === value);
      newTimetable[dayIndex].classes[classIndex] = {
        ...newTimetable[dayIndex].classes[classIndex],
        subject: value,
        faculty: subjectObj
          ? subjectObj.faculty
          : newTimetable[dayIndex].classes[classIndex].faculty,
      };
    } else {
      newTimetable[dayIndex].classes[classIndex] = {
        ...newTimetable[dayIndex].classes[classIndex],
        [field]: value,
      };
    }
    setTimetableData(newTimetable);
  };

  // Check for faculty conflicts
  const hasConflict = (dayIndex, classIndex, faculty) => {
    if (!faculty || faculty === "") return false;
    const day = timetableData[dayIndex];
    return day.classes.some(
      (cls, idx) =>
        idx !== classIndex &&
        cls.faculty === faculty &&
        cls.subject !== "" &&
        cls.subject !== "RECESS" &&
        cls.type !== "Break" &&
        cls.type !== "Activity"
    );
  };

  // Add a new time slot (column)
  const addTimeSlot = () => {
    if (!newTimeSlot.trim()) {
      setSaveStatus("Time slot cannot be empty.");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    const timeSlotRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
    if (!timeSlotRegex.test(newTimeSlot.trim())) {
      setSaveStatus("Invalid time slot format. Use HH:MM-HH:MM.");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    if (timeSlots.includes(newTimeSlot.trim())) {
      setSaveStatus("Time slot already exists.");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    const newTimeSlots = [...timeSlots, newTimeSlot.trim()];
    setTimeSlots(newTimeSlots);
    const newTimetable = timetableData.map((day) => {
      if (
        day.day === "Sat" &&
        day.classes.length === 1 &&
        day.classes[0].colSpan
      ) {
        return {
          ...day,
          classes: [{ ...day.classes[0], colSpan: newTimeSlots.length }],
        };
      }
      return {
        ...day,
        classes: [...day.classes, { subject: "", type: "Theory", faculty: "" }],
      };
    });
    setTimetableData(newTimetable);
    setNewTimeSlot("");
    setSaveStatus("Time slot added successfully.");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  // Add a new day (row)
  const addDay = () => {
    if (!newDayName.trim()) {
      setSaveStatus("Please enter a day name.");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    if (timetableData.some((day) => day.day === newDayName)) {
      setSaveStatus("Day already exists.");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    const newDay = {
      day: newDayName,
      classes: Array(timeSlots.length).fill({
        subject: "",
        type: "Theory",
        faculty: "",
      }),
    };
    setTimetableData([...timetableData, newDay]);
    setNewDayName("");
    setSaveStatus("Day added successfully.");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  // Add a class to a day
  const addClassToDay = (dayIndex) => {
    const newTimetable = [...timetableData];
    if (
      newTimetable[dayIndex].day === "Sat" &&
      newTimetable[dayIndex].classes.length === 1 &&
      newTimetable[dayIndex].classes[0].colSpan
    ) {
      setSaveStatus("Cannot add classes to an all-day activity.");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    newTimetable[dayIndex].classes.push({
      subject: "",
      type: "Theory",
      faculty: "",
    });
    setTimetableData(newTimetable);
    setSaveStatus("Class added to day.");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  // Remove a class from a day
  const removeClassFromDay = (dayIndex, classIndex) => {
    const newTimetable = [...timetableData];
    if (
      newTimetable[dayIndex].day === "Sat" &&
      newTimetable[dayIndex].classes.length === 1 &&
      newTimetable[dayIndex].classes[0].colSpan
    ) {
      setSaveStatus("Cannot remove the all-day activity.");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    if (newTimetable[dayIndex].classes.length <= 1) {
      setSaveStatus("Cannot remove the last class from a day.");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    newTimetable[dayIndex].classes.splice(classIndex, 1);
    setTimetableData(newTimetable);
    setSaveStatus("Class removed from day.");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  // Remove a day
  const removeDay = (dayIndex) => {
    if (timetableData.length <= 1) {
      setSaveStatus("Cannot remove the last day.");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    const newTimetable = [...timetableData];
    newTimetable.splice(dayIndex, 1);
    setTimetableData(newTimetable);
    setSaveStatus("Day removed successfully.");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  // Remove a time slot
  const removeTimeSlot = (timeSlotIndex) => {
    if (timeSlots.length <= 1) {
      setSaveStatus("Cannot remove the last time slot.");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    const newTimeSlots = [...timeSlots];
    newTimeSlots.splice(timeSlotIndex, 1);
    setTimeSlots(newTimeSlots);
    const newTimetable = timetableData.map((day) => {
      if (
        day.day === "Sat" &&
        day.classes.length === 1 &&
        day.classes[0].colSpan
      ) {
        return {
          ...day,
          classes: [{ ...day.classes[0], colSpan: newTimeSlots.length }],
        };
      }
      const newClasses = [...day.classes];
      if (timeSlotIndex < newClasses.length) {
        newClasses.splice(timeSlotIndex, 1);
      }
      return { ...day, classes: newClasses };
    });
    setTimetableData(newTimetable);
    setSaveStatus("Time slot removed successfully.");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  // Export timetable to PDF (placeholder)
  const exportToPDF = () => {
    const latexContent = `
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{booktabs}
\\usepackage{noto}
\\begin{document}
\\begin{center}
  \\textbf{\\large ${collegeInfo.department}} \\\\
  \\small ${collegeInfo.status} \\\\
  \\small ${collegeInfo.address} \\\\
  \\small ${collegeInfo.year} \\quad Semester: ${
      collegeInfo.semester
    } \\quad Section: ${collegeInfo.section} \\quad ${
      collegeInfo.date
    } \\quad ${collegeInfo.room}
\\end{center}
\\vspace{10mm}
\\begin{table}[h]
  \\centering
  \\small
  \\begin{tabular}{|l|${"c|".repeat(timeSlots.length)}}
    \\hline
    \\textbf{Day} & ${timeSlots.join(" & ")} \\\\
    \\hline
    ${timetableData
      .map(
        (day) =>
          `\\textbf{${day.day}} & ${day.classes
            .map((cls) =>
              cls.colSpan
                ? `\\multicolumn{${cls.colSpan}}{c|}{${cls.subject} (${cls.type})}`
                : `${cls.subject}${cls.faculty ? ` (${cls.faculty})` : ""} (${
                    cls.type
                  })`
            )
            .join(" & ")} \\\\`
      )
      .join("\n    \\hline\n")}
    \\hline
  \\end{tabular}
  \\caption{Timetable}
\\end{table}
\\end{document}
    `;
    const blob = new Blob([latexContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "timetable.tex";
    a.click();
    URL.revokeObjectURL(url);
    setSaveStatus("Timetable exported as LaTeX.");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  if (loading) {
    return <div className="text-center p-4">Loading timetable...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      {/* Header and Controls */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          {collegeInfo.department}
        </h1>
        <p className="text-sm text-center text-gray-600 mb-4">
          {collegeInfo.status} | {collegeInfo.address}
        </p>
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div>
            <span className="font-semibold">Employee ID: {employeeId}</span>
            <span className="mx-2">|</span>
            <span className="font-semibold">
              Semester: {collegeInfo.semester}
            </span>
            <span className="mx-2">|</span>
            <span className="font-semibold">
              Section: {collegeInfo.section}
            </span>
          </div>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg transition ${
                isEditing
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isEditing ? "Cancel Editing" : "Edit Timetable"}
            </button>
            {isEditing ? (
              <button
                onClick={updateTimetable}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={saveTimetable}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Save Timetable
              </button>
            )}
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              Export PDF
            </button>
          </div>
        </div>
        {saveStatus && (
          <div
            className={`text-center p-2 rounded ${
              saveStatus.includes("Failed") || saveStatus.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {saveStatus}
          </div>
        )}
      </div>

      {/* Faculty Filter */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Faculty:</label>
        <select
          value={selectedFacultyFilter}
          onChange={(e) => setSelectedFacultyFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Faculties</option>
          {faculties.map((faculty, index) => (
            <option key={index} value={faculty}>
              {faculty}
            </option>
          ))}
        </select>
      </div>

      {/* Edit Mode Controls */}
      {isEditing && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-bold mb-3">Edit Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Semester and Section */}
            <div>
              <label className="block mb-1 font-medium">Semester</label>
              <select
                value={collegeInfo.semester}
                onChange={(e) =>
                  setCollegeInfo({ ...collegeInfo, semester: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Section</label>
              <select
                value={collegeInfo.section}
                onChange={(e) =>
                  setCollegeInfo({ ...collegeInfo, section: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                {sections.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
            {/* Time Slot Management */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Time Slots</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  placeholder="HH:MM-HH:MM"
                  className="flex-1 p-2 border rounded-l"
                />
                <button
                  onClick={addTimeSlot}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 rounded px-2 py-1"
                  >
                    <span className="mr-2">{slot}</span>
                    <button
                      onClick={() => removeTimeSlot(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Day Management */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Add New Day</label>
              <div className="flex mb-2">
                <select
                  value={newDayName}
                  onChange={(e) => setNewDayName(e.target.value)}
                  className="flex-1 p-2 border rounded-l"
                >
                  <option value="">Select Day</option>
                  {days
                    .filter((day) => !timetableData.some((d) => d.day === day))
                    .map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                </select>
                <button
                  onClick={addDay}
                  className="px-4 py-2 bg-green-600 text-white rounded-r hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            </div>
            {/* Subject Management */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Subjects</label>
                <button
                  onClick={addSubject}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Add Subject
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto border rounded">
                {subjects.map((subject, index) => (
                  <div key={index} className="p-2 border-b flex">
                    <input
                      type="text"
                      value={subject.code}
                      onChange={(e) => {
                        const newSubjects = [...subjects];
                        newSubjects[index].code = e.target.value;
                        setSubjects(newSubjects);
                      }}
                      className="w-1/4 p-1 border rounded mr-2"
                      placeholder="Code"
                    />
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => {
                        const newSubjects = [...subjects];
                        newSubjects[index].name = e.target.value;
                        setSubjects(newSubjects);
                      }}
                      className="w-1/2 p-1 border rounded mr-2"
                      placeholder="Subject Name"
                    />
                    <select
                      value={subject.faculty}
                      onChange={(e) => {
                        const newSubjects = [...subjects];
                        newSubjects[index].faculty = e.target.value;
                        setSubjects(newSubjects);
                      }}
                      className="w-1/4 p-1 border rounded"
                    >
                      <option value="">Select Faculty</option>
                      {faculties.map((faculty, i) => (
                        <option key={i} value={faculty}>
                          {faculty}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 w-24">Day/Time</th>
              {timeSlots.map((slot, index) => (
                <th key={index} className="border p-2 text-sm relative">
                  {slot}
                  {isEditing && (
                    <button
                      onClick={() => removeTimeSlot(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      title="Remove time slot"
                    >
                      ×
                    </button>
                  )}
                </th>
              ))}
              {isEditing && (
                <th className="border p-2 w-10">
                  <button
                    onClick={addTimeSlot}
                    className="w-full bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Add time slot"
                  >
                    +
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {timetableData
              .filter((day) =>
                selectedFacultyFilter
                  ? day.classes.some(
                      (cls) => cls.faculty === selectedFacultyFilter
                    )
                  : true
              )
              .map((day, dayIndex) => (
                <tr
                  key={dayIndex}
                  className={dayIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border p-2 font-bold text-center bg-gray-100 relative">
                    {day.day}
                    {isEditing && (
                      <button
                        onClick={() => removeDay(dayIndex)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        title="Remove day"
                      >
                        ×
                      </button>
                    )}
                  </td>
                  {day.classes.map((cls, classIndex) => {
                    const isEditingThisCell =
                      isEditing &&
                      editingCell?.dayIndex === dayIndex &&
                      editingCell?.classIndex === classIndex;
                    const conflict = hasConflict(
                      dayIndex,
                      classIndex,
                      cls.faculty
                    );
                    if (day.day === "Sat" && cls.colSpan) {
                      return (
                        <td
                          key={classIndex}
                          colSpan={cls.colSpan}
                          className="border p-2 text-center bg-yellow-50"
                          onClick={() => handleCellClick(dayIndex, classIndex)}
                        >
                          {isEditingThisCell ? (
                            <div className="p-2">
                              <input
                                type="text"
                                value={cls.subject}
                                onChange={(e) =>
                                  updateCellData("subject", e.target.value)
                                }
                                className="w-full p-1 border rounded mb-1"
                                placeholder="Activity Name"
                              />
                              <select
                                value={cls.type}
                                onChange={(e) =>
                                  updateCellData("type", e.target.value)
                                }
                                className="w-full p-1 border rounded"
                              >
                                {classTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div className="font-semibold">
                              {cls.subject} ({cls.type})
                            </div>
                          )}
                        </td>
                      );
                    }
                    if (cls.subject === "RECESS") {
                      return (
                        <td
                          key={classIndex}
                          className="border p-2 text-center bg-gray-200 font-bold"
                          onClick={() => handleCellClick(dayIndex, classIndex)}
                        >
                          RECESS
                        </td>
                      );
                    }
                    return (
                      <td
                        key={classIndex}
                        className={`border p-2 ${
                          conflict ? "bg-red-100" : ""
                        } ${cls.subject ? "bg-white" : "bg-gray-100"} ${
                          isEditing ? "cursor-pointer hover:bg-blue-50" : ""
                        }`}
                        onClick={() => handleCellClick(dayIndex, classIndex)}
                      >
                        {isEditingThisCell ? (
                          <div className="space-y-2">
                            <select
                              value={cls.subject}
                              onChange={(e) =>
                                updateCellData("subject", e.target.value)
                              }
                              className="w-full p-1 border rounded"
                            >
                              <option value="">Select Subject</option>
                              {subjects.map((subject, i) => (
                                <option key={i} value={subject.name}>
                                  {subject.code}: {subject.name}
                                </option>
                              ))}
                            </select>
                            <select
                              value={cls.type}
                              onChange={(e) =>
                                updateCellData("type", e.target.value)
                              }
                              className="w-full p-1 border rounded"
                            >
                              {classTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            <select
                              value={cls.faculty}
                              onChange={(e) =>
                                updateCellData("faculty", e.target.value)
                              }
                              className={`w-full p-1 border rounded ${
                                conflict ? "border-red-500" : ""
                              }`}
                              disabled={
                                cls.type === "Break" || cls.type === "Activity"
                              }
                            >
                              <option value="">Select Faculty</option>
                              {faculties.map((faculty, i) => (
                                <option key={i} value={faculty}>
                                  {faculty}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="relative">
                            {isEditing && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeClassFromDay(dayIndex, classIndex);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                title="Remove class"
                              >
                                ×
                              </button>
                            )}
                            {cls.subject && (
                              <div className="font-semibold">{cls.subject}</div>
                            )}
                            {cls.type && cls.type !== "Theory" && (
                              <div className="text-xs text-gray-600">
                                ({cls.type})
                              </div>
                            )}
                            {cls.faculty && (
                              <div className="text-xs mt-1 text-blue-600">
                                {cls.faculty}
                              </div>
                            )}
                            {conflict && (
                              <div className="text-xs mt-1 text-red-600">
                                Faculty conflict!
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  {isEditing && (
                    <td className="border p-2">
                      <button
                        onClick={() => addClassToDay(dayIndex)}
                        className="w-full bg-green-500 text-white rounded hover:bg-green-600"
                        title="Add class to day"
                      >
                        +
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden mt-4">
        <div className="flex overflow-x-auto mb-2 bg-white rounded-lg shadow-sm">
          {timetableData
            .filter((day) =>
              selectedFacultyFilter
                ? day.classes.some(
                    (cls) => cls.faculty === selectedFacultyFilter
                  )
                : true
            )
            .map((day, index) => (
              <button
                key={index}
                onClick={() => setActiveDay(index)}
                className={`px-4 py-2 text-center whitespace-nowrap flex-shrink-0 transition-all ${
                  activeDay === index
                    ? "bg-blue-600 text-white font-bold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {day.day}
              </button>
            ))}
        </div>
        <div className="bg-white rounded-lg shadow-md p-3">
          <h3 className="font-bold text-lg mb-3 text-gray-700">
            {timetableData[activeDay].day}'s Schedule
          </h3>
          {timetableData[activeDay].classes.map((cls, classIndex) => {
            const conflict = hasConflict(activeDay, classIndex, cls.faculty);
            if (cls.subject === "RECESS") {
              return (
                <div
                  key={classIndex}
                  className="border-t border-b border-gray-200 my-3 py-2 text-center font-bold text-gray-500 bg-gray-100 rounded-md"
                >
                  RECESS | {timeSlots[classIndex] || "N/A"}
                </div>
              );
            }
            if (cls.colSpan && cls.colSpan > 1) {
              return (
                <div
                  key={classIndex}
                  className="mb-3 p-4 rounded-lg shadow-sm bg-white border-l-4 border-gray-200"
                  onClick={() => handleCellClick(activeDay, classIndex)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">All Day</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full shadow-sm font-medium">
                      {cls.type}
                    </span>
                  </div>
                  <div className="mt-2 font-semibold text-lg">
                    {cls.subject}
                  </div>
                  {cls.faculty && (
                    <div className="text-sm mt-1">{cls.faculty}</div>
                  )}
                </div>
              );
            }
            return (
              <div
                key={classIndex}
                className={`mb-3 p-4 rounded-lg shadow-sm bg-white border-l-4 ${
                  conflict ? "border-red-500" : "border-gray-200"
                } ${isEditing ? "cursor-pointer" : ""}`}
                onClick={() => handleCellClick(activeDay, classIndex)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700">
                    {timeSlots[classIndex] || "N/A"}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full shadow-sm font-medium">
                    {cls.type}
                  </span>
                </div>
                <div className="mt-2 font-semibold text-lg text-gray-800">
                  {cls.subject || "Empty"}
                </div>
                {cls.faculty && (
                  <div className="text-sm mt-1">{cls.faculty}</div>
                )}
                {conflict && (
                  <div className="text-sm mt-1 text-red-600">
                    Faculty conflict!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editing Instructions */}
      {isEditing && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="font-semibold">Editing Instructions:</p>
          <ul className="list-disc pl-5">
            <li>Click on any cell to edit its subject, type, or faculty.</li>
            <li>Use + buttons to add time slots, days, or classes.</li>
            <li>Use × buttons to remove time slots, days, or classes.</li>
            <li>Add or edit subjects in the Subjects section.</li>
            <li>Faculty conflicts are highlighted in red.</li>
            <li>Saturday’s all-day activity spans all time slots.</li>
            <li>RECESS periods cannot be edited.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
