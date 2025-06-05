import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Check,
  FileText,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserProfile({ userData }) {
  const navigate = useNavigate();
  const typeDisplayNames = {
    director: "Director",
    principal: "Principal",
    HOD: "Head of Department",
    teaching: "Teacher",
    nonteaching: "Non-Teaching Staff",
  };

  const [profileData, setProfileData] = useState({
    employeeId: userData?.employeeId || "",
    name: `userData?.firstname + lastname` || "",
    gender: userData?.gender || "",
    dateOfBirth: userData?.dateOfBirth || "",
    email: userData?.email || "",
    mobile: userData?.mobile || "",
    address: userData?.address || "",
    aadhaar: userData?.aadhaar || "",
    department: userData?.department || "",
    designation: userData?.designation || "",
    dateOfJoining: userData?.dateOfJoining || "",
    employmentType: userData?.employmentType || "",
    status: userData?.status || "Active",
    type: userData?.type || "teaching",
    teachingExperience: userData?.teachingExperience || 0,
    subjectsTaught: userData?.subjectsTaught || [],
    classIncharge: userData?.classIncharge || "",
    researchPublications: userData?.researchPublications || [],
    technicalSkills: userData?.technicalSkills || [],
    workExperience: userData?.workExperience || 0,
  });

  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching profile with token:", userData?.token);
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        console.log("API Response Status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("API Response Data:", data);
          const updatedProfile = {
            employeeId: data.employeeId || "",
            name: data.firstName + " " + data.lastName || "",
            gender: data.gender || "",
            dateOfBirth: data.dateOfBirth || "",
            email: data.email || "",
            mobile: data.mobile || "",
            address: data.address || "",
            aadhaar: data.aadhaar || "",
            department: data.department || "",
            designation: data.designation || "",
            dateOfJoining: data.dateOfJoining || "",
            employmentType: data.employmentType || "",
            status: data.status || "Active",
            type: data.type || "teaching",
            teachingExperience: data.teachingExperience || 0,
            subjectsTaught: data.subjectsTaught || [],
            classIncharge: data.classIncharge || "",
            researchPublications: data.researchPublications || [],
            technicalSkills: data.technicalSkills || [],
            workExperience: data.workExperience || 0,
          };
          setProfileData(updatedProfile);
          console.log("Updated profileData:", updatedProfile);
          const updatedUser = {
            ...JSON.parse(localStorage.getItem("user")),
            ...updatedProfile,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          showNotification(
            `Failed to fetch profile: ${
              errorData.message || response.statusText
            }`
          );
          if (response.status === 401) {
            showNotification("Session expired. Please log in again.");
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
            navigate("/login");
          }
        }
      } catch (err) {
        console.error("Fetch Profile Error:", err);
        showNotification("Failed to connect to the server");
      } finally {
        setIsLoading(false);
      }
    };

    if (userData?.token) {
      fetchProfile();
    } else {
      console.warn("No token found in userData");
      showNotification("Please log in again");
      navigate("/login");
    }
  }, [userData?.token, navigate]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const profileSections = [
    {
      id: "personal",
      title: "Personal Details",
      icon: <User size={18} className="text-blue-500" />,
      fields: [
        {
          id: "employeeId",
          label: "Employee ID",
          icon: <Shield size={16} className="text-blue-500" />,
        },
        {
          id: "name",
          label: "Name",
          icon: <User size={16} className="text-green-500" />,
        },
        {
          id: "gender",
          label: "Gender",
          icon: <User size={16} className="text-purple-500" />,
        },
        {
          id: "dateOfBirth",
          label: "Date of Birth",
          icon: <Calendar size={16} className="text-red-500" />,
        },
        {
          id: "aadhaar",
          label: "Aadhaar Number",
          icon: <FileText size={16} className="text-gray-500" />,
        },
      ],
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: <Phone size={18} className="text-green-500" />,
      fields: [
        {
          id: "email",
          label: "Email Address",
          icon: <Mail size={16} className="text-red-500" />,
        },
        {
          id: "mobile",
          label: "Mobile Number",
          icon: <Phone size={16} className="text-blue-500" />,
        },
        {
          id: "address",
          label: "Address",
          icon: <MapPin size={16} className="text-green-500" />,
        },
      ],
    },
    {
      id: "employment",
      title: "Employment Details",
      icon: <Briefcase size={18} className="text-purple-500" />,
      fields: [
        {
          id: "department",
          label: "Department",
          icon: <Briefcase size={16} className="text-indigo-500" />,
        },
        {
          id: "designation",
          label: "Designation",
          icon: <Briefcase size={16} className="text-blue-500" />,
        },
        {
          id: "dateOfJoining",
          label: "Date of Joining",
          icon: <Calendar size={16} className="text-purple-500" />,
        },
        {
          id: "employmentType",
          label: "Employment Type",
          icon: <FileText size={16} className="text-teal-500" />,
        },
        {
          id: "status",
          label: "Status",
          icon: <Check size={16} className="text-green-500" />,
        },
        {
          id: "type",
          label: "Type",
          icon: <Briefcase size={16} className="text-gray-500" />,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      {notification && (
        <div className="fixed top-4 right-4 bg-white border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg flex items-center z-50 max-w-xs animate-fade-in-down">
          <Check size={20} className="mr-3 text-green-500 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto">
        {/* Header with user info */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 md:mb-0 md:mr-4">
                  <User size={32} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {profileData.firstname || "User Profile"}
                  </h2>
                  <p className="text-white font-medium text-sm mt-1 opacity-90">
                    {typeDisplayNames[profileData.type] || profileData.type} •{" "}
                    {profileData.designation || "Staff Member"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg px-3 py-2 flex items-center">
                  <Mail size={16} className="text-white mr-2" />
                  <span className="">{profileData.email || "Not set"}</span>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg px-3 py-2 flex items-center">
                  <Phone size={16} className="text-white mr-2" />
                  <span className="">{profileData.mobile || "Not set"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 flex flex-wrap gap-3 bg-gray-50">
            <div className="flex items-center">
              <Shield size={16} className="text-blue-500 mr-2" />
              <span className="text-sm font-medium">
                ID: {profileData.employeeId || "Not set"}
              </span>
            </div>
            <div className="flex items-center">
              <Briefcase size={16} className="text-purple-500 mr-2" />
              <span className="text-sm font-medium">
                Dept: {profileData.department || "Not set"}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="text-red-500 mr-2" />
              <span className="text-sm font-medium">
                Joined: {profileData.dateOfJoining || "Not set"}
              </span>
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              <span className="text-sm font-medium">
                Status: {profileData.status || "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {profileSections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100 transition-all duration-200 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    {section.icon}
                    <h3 className="ml-2 text-lg font-semibold text-gray-800">
                      {section.title}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.fields?.map((field) => (
                    <div key={field.id} className="group">
                      <div className="flex items-center mb-1 text-gray-500">
                        {field.icon}
                        <span className="ml-2 text-xs font-medium uppercase tracking-wide">
                          {field.label}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md border border-gray-100 transition-all">
                        <p className="text-sm font-medium text-gray-800">
                          {profileData[field.id] || "Not set"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {section.arrays?.map((arrayField) => (
                  <div
                    key={arrayField.id}
                    className="mt-6 border-t border-gray-100 pt-4"
                  >
                    <div className="flex items-center mb-3 text-gray-500">
                      {arrayField.icon}
                      <span className="ml-2 text-xs font-medium uppercase tracking-wide">
                        {arrayField.label}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-md border border-gray-100 p-3">
                      {profileData[arrayField.id]?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profileData[arrayField.id].map((item, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white border border-gray-200 text-gray-700"
                            >
                              {item || "Not set"}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No items added
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Info Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100 mt-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin size={18} className="text-red-500 mr-2" />
              Address & Contact
            </h3>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-100 mb-4">
              <p className="text-gray-800">
                {profileData.address || "Address not set"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-md border border-blue-100">
                <Mail size={18} className="text-blue-600 mr-3" />
                <div>
                  <p className="text-xs font-medium text-blue-500">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {profileData.email || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-green-50 rounded-md border border-green-100">
                <Phone size={18} className="text-green-600 mr-3" />
                <div>
                  <p className="text-xs font-medium text-green-500">
                    Mobile Number
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {profileData.mobile || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
