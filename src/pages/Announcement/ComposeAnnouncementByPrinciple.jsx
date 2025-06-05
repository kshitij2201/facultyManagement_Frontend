import React, { useState, useEffect } from "react";
import axios from "axios";

const AnnouncementForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
    endDate: "",
    visibleTo: [],
  });

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const roles = ["student", "teaching_staff", "non_teaching_staff", "hod"];
  const currentDashboard = "hod";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      visibleTo: checked
        ? [...prev.visibleTo, value]
        : prev.visibleTo.filter((role) => role !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("faculty-management-backend.vercel.app/api/announcements", formData);
      alert("Announcement Created Successfully");
      setFormData({
        title: "",
        description: "",
        tag: "",
        endDate: "",
        visibleTo: [],
      });
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert("Failed to create announcement");
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(
        `faculty-management-backend.vercel.app/api/announcements/${currentDashboard}`
      );
      setAnnouncements(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight">
          Announcement Dashboard
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Create Announcement Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Create New Announcement
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter announcement title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50 resize-y"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Enter announcement details"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag
                  </label>
                  <input
                    type="text"
                    name="tag"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50"
                    value={formData.tag}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Urgent, Event"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Visible To
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map((role) => (
                      <label
                        key={role}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <input
                          type="checkbox"
                          value={role}
                          checked={formData.visibleTo.includes(role)}
                          onChange={handleCheckboxChange}
                          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="capitalize">
                          {role.replace("_", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  Create Announcement
                </button>
              </form>
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Recent Announcements
              </h2>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : announcements.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No announcements found.
                </p>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement._id}
                      className="p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {announcement.description}
                      </p>
                      <div className="text-sm text-gray-500 flex flex-wrap gap-3">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          Tag: {announcement.tag}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Visible To: {announcement.visibleTo.join(", ")}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                          Expires:{" "}
                          {new Date(announcement.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementForm;
