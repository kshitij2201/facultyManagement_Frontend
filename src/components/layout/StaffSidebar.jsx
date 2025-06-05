import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  CreditCard,
  FileText,
  BookOpen,
  LogOut,
  ChevronRight,
  BookMarked,
  Calendar,
  Award,
} from "lucide-react";
import { rolePermissionsAndRoutes } from "./rolePermissionsAndRoutes";

const globalStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const StaffSidebar = ({ isOpen, handleMenuClick, userData }) => {
  const location = useLocation();
  const [isCC, setIsCC] = useState(false);

  // Check CC status for teaching faculty
  useEffect(() => {
    const checkCCStatus = async () => {
      if (userData?.role !== "teaching") {
        setIsCC(false);
        return;
      }

      try {
        const department = userData.department
          ? userData.department
              .toLowerCase()
              .replace(/\b\w/g, (c) => c.toUpperCase())
          : "";
        const facultyId = userData._id;

        if (!facultyId || !department) {
          console.warn("[SidebarCCStatus] Missing facultyId or department");
          return;
        }

        console.log("[SidebarCCStatus] Fetching for:", {
          facultyId,
          department,
        });
        const response = await fetch(
          `http://localhost:5000/api/faculty/cc-assignments?department=${encodeURIComponent(
            department
          )}`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        if (!response.ok) {
          console.warn("[SidebarCCStatus] API error:", response.status);
          return;
        }

        const data = await response.json();
        console.log("[SidebarCCStatus] API response:", data);
        const assignments = Array.isArray(data.data)
          ? data.data.filter((cc) => cc.facultyId === facultyId)
          : [];
        setIsCC(assignments.length > 0);
        console.log("[SidebarCCStatus] Is CC:", assignments.length > 0);
      } catch (err) {
        console.error("[SidebarCCStatus] Error:", err);
      }
    };

    checkCCStatus();
  }, [userData]);

  const roleDisplayNames = {
    director: "Director",
    principal: "Principal",
    HOD: "Head of Department",
    teaching: "Teacher",
    nonteaching: "Non-Teaching Staff",
    facultymanagement: "Faculty Management",
  };

  const getAnnouncementRoute = (role) => {
    if (role === "HOD") return "/dashboard/compose-hod-announcement";
    if (role === "principal")
      return "/dashboard/compose-principal-announcement";
    if (role === "nonteaching") return "/dashboard/announcementnonteaching";
    return "/dashboard/announcement";
  };

  const getApproveLeaveRoute = (role) => {
    if (role === "principal") return "/dashboard/approveleavebyprincipal";
    return "/dashboard/approveleave";
  };

  const getAnnouncementTitle = (role) => {
    if (role === "HOD" || role === "principal") return "Compose Announcement";
    return "Announcements";
  };

  const getDashboardRoute = (role) => {
    if (role === "HOD") return "/hod-dashboard";
    if (role === "principal") return "/principal-dashboard";
    return "/dashboard";
  };

  const getAllStaffRoute = (role) => {
    if (role === "HOD") return "/dashboard/departmentfaculty";
    return "/dashboard/allstaff";
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      href: getDashboardRoute(userData?.role),
      routeName: "dashboard",
    },
    {
      title: "Profile",
      icon: <User size={20} />,
      href: "/dashboard/profile",
      routeName: "profile",
    },
    {
      title: "Pay Slip",
      icon: <CreditCard size={20} />,
      href: "/dashboard/payslip",
      routeName: "payslip",
    },
    {
      title: getAnnouncementTitle(userData?.role),
      icon: <FileText size={20} />,
      href: getAnnouncementRoute(userData?.role),
      routeName:
        userData?.role === "HOD"
          ? "compose_hod_announcement"
          : userData?.role === "principal"
          ? "compose_principal_announcement"
          : userData?.role === "nonteaching"
          ? "announcement_nonteaching"
          : "announcement",
    },
    {
      title: "Apply Charge Handover",
      icon: <FileText size={20} />,
      href: "/dashboard/applyChargeHandover",
      routeName: "apply_charge_handover",
    },
    {
      title: "Approve Charge Handover",
      icon: <BookMarked size={20} />,
      href: "/dashboard/approveChargeHandover",
      routeName: "approve_charge_handover",
    },
    {
      title: "Apply Leave",
      icon: <FileText size={20} />,
      href: "/dashboard/applyleave",
      routeName: "apply_leave",
    },
    {
      title: "Time Table",
      icon: <FileText size={20} />,
      href: "/dashboard/timetable",
      routeName: "timetable",
    },
    {
      title: "Fetched Timetable",
      icon: <Calendar size={20} />,
      href: "/dashboard/fetched-timetable",
      routeName: "fetched_timetable",
    },
    {
      title: "Approve Leave",
      icon: <BookOpen size={20} />,
      href: getApproveLeaveRoute(userData?.role),
      routeName: "approve_leave",
    },
    {
      title: "All Staff",
      icon: <BookOpen size={20} />,
      href: getAllStaffRoute(userData?.role),
      routeName: "all_staff",
    },
    {
      title: "Apply OD Leave",
      icon: <FileText size={20} />,
      href: "/dashboard/applyodleave",
      routeName: "apply_od_leave",
    },
    {
      title: "Approve OD Leave",
      icon: <User size={20} />,
      href: "/dashboard/approveodleave",
      routeName: "approve_od_leave",
    },
    {
      title: "Mark Attendance",
      icon: <User size={20} />,
      href: "/dashboard/markattendance",
      routeName: "mark_attendance",
    },
    ...(isCC && userData?.role === "teaching"
      ? [
          {
            title: "CC Dashboard",
            icon: <Award size={20} />,
            href: `/cc-dashboard/${userData._id}`,
            routeName: "cc_dashboard",
          },
        ]
      : []),
  ];

  const rolePermissions = rolePermissionsAndRoutes.reduce((acc, role) => {
    acc[role.role] = role.permissions;
    return acc;
  }, {});

  const filteredMenuItems = menuItems.filter((item) =>
    rolePermissions[userData?.role]?.includes(item.routeName)
  );

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed lg:relative lg:translate-x-0 z-10 h-full transition-transform duration-300 ease-in-out bg-gradient-to-br from-indigo-700 to-purple-800 text-white shadow-xl`}
    >
      <style>{globalStyles}</style>
      <div className="flex flex-col h-full w-80">
        <div className="p-6 border-b border-indigo-600/50">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-2">
              <BookOpen className="text-indigo-700" size={24} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              {userData?.role === "HOD"
                ? "HOD Portal"
                : userData?.role === "principal"
                ? "Principal Portal"
                : ["teaching", "nonteaching"].includes(userData?.role)
                ? "Staff Portal"
                : "Admin Portal"}
            </h2>
          </div>
        </div>
        <nav className="flex-grow p-5 overflow-y-auto scrollbar-hide">
          <ul className="space-y-1">
            {filteredMenuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  onClick={() => handleMenuClick(item)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 group ${
                    location.pathname === item.href
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-indigo-600/20 text-white group-hover:bg-indigo-500/30">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-indigo-600/50 pt-4">
            <button
              onClick={() => handleMenuClick({ action: "logout" })}
              className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
            >
              <div className="p-2 rounded-md bg-red-500/20 text-white group-hover:bg-red-500/30">
                <LogOut size={20} />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
        <div className="p-5 border-t border-indigo-600/50">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-600/20">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold">{userData?.email}</p>
              <p className="text-xs text-indigo-200">
                {roleDisplayNames[userData?.role]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffSidebar;
