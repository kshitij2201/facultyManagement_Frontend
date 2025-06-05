import ProtectedRoute from "../layout/ProtectedRoutes";
import Dashboard from "../../pages/Dashboard";
import Profile from "../../pages/Profile";
import PaySlip from "../../pages/PaySlip";
import ApplyLeave from "../../pages/ApplyLeave";
import ApproveLeave from "../../pages/ApproveLeave";
import ApproveChargeHandover from "../../pages/ApproveChargeHandover";
import ApproveODLeave from "../../pages/ApproveODLeave";
import Announcement from "../../pages/Announcement/Announcement";
import ApplyODLeave from "../../pages/ApplyODLeave";
import ApplyChargeHandoverForm from "../../pages/ApplyChargeHandover";
import MarkAttendance from "../../pages/MarkAttendance";
import ComposeAnnouncementByPrincipal from "../../pages/Announcement/ComposeAnnouncementByPrinciple";
import ComposeByHOD from "../../pages/Announcement/ComposeAnnouncemtByHOD";
import NonTeachingAnnouncements from "../../pages/Announcement/AnnoucementNT";
import Payment from "../../pages/FacultyManagement/Payment";
import FacultyListPage from "../../pages/FacultyManagement/FacultyListPage";
import AddFacultyPage from "../../pages/FacultyManagement/AddFacultyPage";
import HODDashboard from "../../pages/HOD/HodDashboard";
import ApproveLeaveByPrincipal from "../../pages/Principal/PrincipalApproveLeave";
import DepartmentFaculty from "../../pages/HOD/DepartmentFaculty";
import FacultyDataInPrincipal from "../../pages/Principal/AllCollegeStaff";
import PrincipalDashboard from "../../pages/Principal/PrincipalDashboard";
import Timetable from "../../pages/HOD/Timetable";
import FetchedTimetable from "../../pages/FetchedTimetable";
// import TeachingCCDashboard from "../../pages/TeachingCCDashboard";

export const rolePermissionsAndRoutes = [
  {
    role: "principal",
    permissions: [
      "dashboard",
      "profile",
      "payslip",
      "all_staff",
      "compose_principal_announcement",
      "approve_leave",
      "approve_od_leave",
      "timetable",
      "fetched_timetable",
    ],
    routes: [
      {
        path: "/principal-dashboard",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="dashboard"
          >
            <PrincipalDashboard
              userData={userData}
              onLogout={() => ({ action: "logout" })}
            />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/profile",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="profile"
          >
            <Profile userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/payslip",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="payslip"
          >
            <PaySlip userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/allstaff",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="all_staff"
          >
            <FacultyDataInPrincipal userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/compose-principal-announcement",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="compose_principal_announcement"
          >
            <ComposeAnnouncementByPrincipal userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/approveleavebyprincipal",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="approve_leave"
          >
            <ApproveLeaveByPrincipal userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/approveodleave",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="approve_od_leave"
          >
            <ApproveODLeave userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/timetable",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="timetable"
          >
            <Timetable userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/fetched-timetable",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="fetched_timetable"
          >
            <FetchedTimetable userData={userData} />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    role: "HOD",
    permissions: [
      "dashboard",
      "profile",
      "payslip",
      "all_staff",
      // "timetable",
      "compose_hod_announcement",
      "apply_charge_handover",
      "approve_charge_handover",
      "apply_leave",
      "approve_leave",
      "apply_od_leave",
      "approve_od_leave",
      "fetched_timetable",
    ],
    routes: [
      {
        path: "/hod-dashboard",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="dashboard"
          >
            <HODDashboard
              userData={userData}
              onLogout={() => ({ action: "logout" })}
            />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/profile",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="profile"
          >
            <Profile userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/payslip",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="payslip"
          >
            <PaySlip userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/timetable",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="timetable"
          >
            <Timetable userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/compose-hod-announcement",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="compose_hod_announcement"
          >
            <ComposeByHOD userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyChargeHandover",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_charge_handover"
          >
            <ApplyChargeHandoverForm userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/approveChargeHandover",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="approve_charge_handover"
          >
            <ApproveChargeHandover userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyleave",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_leave"
          >
            <ApplyLeave userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/approveleave",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="approve_leave"
          >
            <ApproveLeave userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyodleave",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_od_leave"
          >
            <ApplyODLeave userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/approveodleave",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="approve_od_leave"
          >
            <ApproveODLeave userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/departmentfaculty",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="all_staff"
          >
            <DepartmentFaculty userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/fetched-timetable",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="fetched_timetable"
          >
            <FetchedTimetable userData={userData} />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    role: "teaching",
    permissions: [
      "dashboard",
      "profile",
      "mark_attendance",
      "payslip",
      "announcement",
      "apply_charge_handover",
      "apply_leave",
      "apply_od_leave",
      // "timetable",
      "fetched_timetable",
    ],
    routes: [
      {
        path: "/dashboard",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="dashboard"
          >
            <Dashboard
              userData={userData}
              onLogout={() => ({ action: "logout" })}
            />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/profile",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="profile"
          >
            <Profile userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/markattendance",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="mark_attendance"
          >
            <MarkAttendance userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/payslip",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="payslip"
          >
            <PaySlip userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/announcement",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="announcement"
          >
            <Announcement userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyChargeHandover",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_charge_handover"
          >
            <ApplyChargeHandoverForm userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyleave",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_leave"
          >
            <ApplyLeave userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyodleave",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_od_leave"
          >
            <ApplyODLeave userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/timetable",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="timetable"
          >
            <Timetable userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/fetched-timetable",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="fetched_timetable"
          >
            <FetchedTimetable userData={userData} />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    role: "cc",
    permissions: [
      "dashboard",
      "profile",
      "mark_attendance",
      "payslip",
      "announcement",
      "apply_charge_handover",
      "apply_leave",
      "apply_od_leave",
      "timetable",
      "fetched_timetable",
    ],
    routes: [
      {
        path: "/dashboard",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="dashboard"
          >
            <Dashboard
              userData={userData}
              onLogout={() => ({ action: "logout" })}
            />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/profile",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="profile"
          >
            <Profile userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/markattendance",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="mark_attendance"
          >
            <MarkAttendance userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/payslip",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="payslip"
          >
            <PaySlip userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/announcement",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="announcement"
          >
            <Announcement userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyChargeHandover",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_charge_handover"
          >
            <ApplyChargeHandoverForm userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyleave",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_leave"
          >
            <ApplyLeave userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyodleave",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_od_leave"
          >
            <ApplyODLeave userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/timetable",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="timetable"
          >
            <Timetable userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/fetched-timetable",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="fetched_timetable"
          >
            <FetchedTimetable userData={userData} />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    role: "non-teaching",
    permissions: [
      "dashboard",
      "profile",
      "payslip",
      "announcement_nonteaching",
      "apply_charge_handover",
      "apply_leave",
      "apply_od_leave",
      // "timetable",
      "fetched_timetable",
    ],
    routes: [
      {
        path: "/dashboard",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="dashboard"
          >
            <Dashboard
              userData={userData}
              onLogout={() => ({ action: "logout" })}
            />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/profile",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="profile"
          >
            <Profile userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/payslip",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="payslip"
          >
            <PaySlip userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/announcementnonteaching",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="announcement_nonteaching"
          >
            <NonTeachingAnnouncements userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyChargeHandover",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_charge_handover"
          >
            <ApplyChargeHandoverForm userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyleave",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_leave"
          >
            <ApplyLeave userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyodleave",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_od_leave"
          >
            <ApplyODLeave userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/timetable",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="timetable"
          >
            <Timetable userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/fetched-timetable",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="fetched_timetable"
          >
            <FetchedTimetable userData={userData} />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    role: "facultymanagement",
    permissions: [
      "dashboard",
      "add_faculty",
      "view_faculties",
      "payment",
      "faculty_profile",
      "apply_leave",
      "payslip",
      "announcement",
      "timetable",
      "fetched_timetable",
    ],
    routes: [
      {
        path: "/dashboard",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="dashboard"
          >
            <FacultyListPage
              userData={userData}
              onLogout={() => ({ action: "logout" })}
            />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/add-faculty",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="add_faculty"
          >
            <AddFacultyPage userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/view-faculties",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="view_faculties"
          >
            <FacultyListPage userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/payment",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="payment"
          >
            <Payment userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/faculty-profile",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="faculty_profile"
          >
            <Profile userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/applyleave",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="apply_leave"
          >
            <ApplyLeave userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/payslip",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="payslip"
          >
            <PaySlip userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/announcement",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="announcement"
          >
            <Announcement userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/timetable",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="timetable"
          >
            <Timetable userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/fetched-timetable",
        element: (isAuthenticated, userRole, userData) => (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            routeName="fetched_timetable"
          >
            <FetchedTimetable userData={userData} />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
