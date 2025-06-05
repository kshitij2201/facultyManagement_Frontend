import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  CreditCard,
  FileText,
  BookOpen,
  LogOut,
  ChevronRight,
  Users,
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

const FacultySidebar = ({ isOpen, handleMenuClick, userData }) => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home size={20} />,
      href: "/dashboard",
      routeName: "dashboard",
    },
    {
      title: "Add Faculty",
      icon: <BookOpen size={20} />,
      href: "/dashboard/add-faculty",
      routeName: "add_faculty",
    },
    {
      title: "View Faculties",
      icon: <Users size={20} />,
      href: "/dashboard/view-faculties",
      routeName: "view_faculties",
    },
    {
      title: "Payment",
      icon: <CreditCard size={20} />,
      href: "/dashboard/payment",
      routeName: "payment",
    },
    {
      title: "Profile",
      icon: <User size={20} />,
      href: "/dashboard/faculty-profile",
      routeName: "faculty_profile",
    },
    {
      title: "Apply Leave",
      icon: <FileText size={20} />,
      href: "/dashboard/applyleave",
      routeName: "apply_leave",
    },
    {
      title: "Pay Slip",
      icon: <CreditCard size={20} />,
      href: "/dashboard/payslip",
      routeName: "payslip",
    },
    {
      title: "Announcements",
      icon: <FileText size={20} />,
      href: "/dashboard/announcement",
      routeName: "announcement",
    },
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
      <div className="flex flex-col h-full w-72">
        <div className="p-6 border-b border-indigo-600/50">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-2">
              <BookOpen className="text-indigo-700" size={24} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Faculty Management
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
              <p className="text-xs text-indigo-200">Faculty Management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultySidebar;
