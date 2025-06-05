import { useState } from "react";
import {
  Bell,
  Download,
  Mail,
  FileText,
  Calendar,
  X,
  ArrowLeft,
  Check,
  Printer,
} from "lucide-react";

export default function PayrollNotice() {
  const [notices, setNotices] = useState([
    // {
    //   id: 1,
    //   title: "Salary Credits for May 2025",
    //   date: "5/1/2025",
    //   category: "Salary",
    //   message:
    //     "Your salary for the month of May 2025 has been credited to your bank account. Please check your account and confirm.",
    //   isRead: false,
    //   isHighlighted: true,
    //   details: {
    //     amount: "$5,475.00",
    //     accountNumber: "XXXX-XXXX-1234",
    //     transactionId: "TXN487291356",
    //     taxDeducted: "$1,095.00",
    //     netAmount: "$4,380.00",
    //   },
    // },
    // {
    //   id: 2,
    //   title: "Income Tax Form Submission Reminder",
    //   date: "4/28/2025",
    //   category: "Tax",
    //   message:
    //     "This is a reminder to submit your income tax declaration forms for the financial year 2024-25 by May 15, 2025.",
    //   isRead: false,
    //   isHighlighted: true,
    //   details: {
    //     formType: "Form 12BB",
    //     dueDate: "May 15, 2025",
    //     submissionMethod: "HR Portal or Email to tax@company.com",
    //     contactPerson: "Jane Smith (HR)",
    //     contactEmail: "jane.smith@company.com",
    //   },
    {
      id: 3,
      title: "Annual Salary Increment Notification",
      date: "4/20/2025",
      category: "Salary",
      message:
        "We are pleased to inform you that the annual salary increments have been approved and will be reflected in your May 2025 salary.",
      isRead: true,
      isHighlighted: false,
      details: {
        incrementPercentage: "7.5%",
        effectiveFrom: "May 1, 2025",
        newBasicSalary: "$4,300.00",
        newGrossSalary: "$5,900.00",
        approvedBy: "Thomas Wilson, HR Director",
      },
    },
    {
      id: 4,
      title: "New Leave Policy Update",
      date: "4/15/2025",
      category: "Policy",
      message:
        "Please note that there have been changes to the faculty leave policy effective May 1, 2025. The earned leave accumulation cap has been increased from 240 to 300 days.",
      isRead: true,
      isHighlighted: false,
      details: {
        policyReference: "HR-POL-2025-042",
        effectiveDate: "May 1, 2025",
        keyChanges: [
          "Earned leave accumulation cap increased from 240 to 300 days",
          "Additional 5 days of casual leave for employees with 5+ years of service",
          "Sick leave can now be encashed at 50% value at year end",
        ],
        approvedBy: "Board of Directors",
        policyDocument: "Leave_Policy_2025_v2.pdf",
      },
    },
    {
      id: 5,
      title: "Tax Deduction Summary for FY 2024-25",
      date: "4/10/2025",
      category: "Tax",
      message:
        "Your tax deduction summary for the financial year 2024-25 is now available for review.",
      isRead: true,
      isHighlighted: false,
      details: {
        financialYear: "2024-25",
        totalEarnings: "$70,500.00",
        totalDeductions: "$12,690.00",
        netTaxableIncome: "$57,810.00",
        taxPaid: "$11,562.00",
        formReference: "Form 26AS",
      },
    },
  ]);

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const markAsRead = (id) => {
    setNotices(
      notices.map((notice) =>
        notice.id === id
          ? { ...notice, isRead: true, isHighlighted: false }
          : notice
      )
    );
  };

  const markAllAsRead = () => {
    setNotices(
      notices.map((notice) => ({
        ...notice,
        isRead: true,
        isHighlighted: false,
      }))
    );
  };

  const handleDownload = (e, notice) => {
    e.stopPropagation(); // Prevent opening the form
    alert(`Downloading details for: ${notice.title}`);
    // Implement actual download logic here
  };

  const handleEmail = (e, notice) => {
    e.stopPropagation(); // Prevent opening the form
    alert(`Sending email for: ${notice.title}`);
    // Implement actual email sending logic here
  };

  const handleViewDetails = (e, notice) => {
    e.stopPropagation(); // Prevent opening the form
    alert(`Viewing details:\n\n${notice.message}`);
    // You could replace this with a modal view
  };

  const openNoticeForm = (notice) => {
    if (!notice.isRead) {
      markAsRead(notice.id);
    }
    setSelectedNotice(notice);
    setShowForm(true);
  };

  const closeNoticeForm = () => {
    setShowForm(false);
    setSelectedNotice(null);
  };

  const getCategoryBadgeClasses = (category) => {
    const baseClasses = "text-xs px-2 py-0.5 rounded-md font-medium";
    switch (category) {
      case "Salary":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Tax":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "Policy":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Notice List View
  const renderNoticeList = () => (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Payroll Notices
        </h1>
        <button
          onClick={markAllAsRead}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <Bell className="h-4 w-4 mr-1" />
          Mark All as Read
        </button>
      </div>

      {/* Notices section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">Recent Notices</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {notices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => openNoticeForm(notice)}
              className={`p-4 md:p-5 hover:bg-blue-50 cursor-pointer transition-colors ${
                notice.isHighlighted ? "border-l-4 border-blue-500" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div className="flex items-center mb-2 md:mb-0">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      notice.isRead ? "invisible" : "bg-blue-500"
                    }`}
                  ></div>
                  <h3 className="text-base md:text-lg font-medium text-gray-900">
                    {notice.title}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notice.id);
                  }}
                  className="self-end md:self-auto text-sm text-gray-500 hover:text-gray-700"
                >
                  Mark as Read
                </button>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>{notice.date}</span>
                <span className="mx-2">•</span>
                <span className={getCategoryBadgeClasses(notice.category)}>
                  {notice.category}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{notice.message}</p>

              <div className="flex space-x-2 justify-end">
                <button
                  onClick={(e) => handleDownload(e, notice)}
                  className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-blue-100 rounded-md"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => handleEmail(e, notice)}
                  className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-blue-100 rounded-md"
                >
                  <Mail className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => handleViewDetails(e, notice)}
                  className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-blue-100 rounded-md"
                >
                  <FileText className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state for when there are no notices */}
      {notices.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Notices</h3>
          <p className="text-gray-500">
            You don't have any payroll notices at the moment.
          </p>
        </div>
      )}
    </div>
  );

  // Notice Form View
  const renderNoticeForm = () => {
    if (!selectedNotice) return null;

    // Generate form content based on notice category
    const renderFormContent = () => {
      const details = selectedNotice.details || {};

      switch (selectedNotice.category) {
        case "Salary":
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Payment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Amount:</span>
                      <span className="font-medium">{details.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Deducted:</span>
                      <span className="font-medium">{details.taxDeducted}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-gray-800 font-medium">
                        Net Amount:
                      </span>
                      <span className="font-bold text-green-600">
                        {details.netAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Transaction Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium">
                        {details.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-medium">
                        {details.accountNumber}
                      </span>
                    </div>
                    {details.incrementPercentage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Increment:</span>
                        <span className="font-medium text-green-600">
                          {details.incrementPercentage}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {details.effectiveFrom && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-3">
                    Salary Increment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">New Basic Salary:</span>
                      <span className="font-medium">
                        {details.newBasicSalary}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">New Gross Salary:</span>
                      <span className="font-medium">
                        {details.newGrossSalary}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Effective From:</span>
                      <span className="font-medium">
                        {details.effectiveFrom}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );

        case "Tax":
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Tax Information
                  </h3>
                  <div className="space-y-3">
                    {details.formType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Form Type:</span>
                        <span className="font-medium">{details.formType}</span>
                      </div>
                    )}
                    {details.dueDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className="font-medium text-red-600">
                          {details.dueDate}
                        </span>
                      </div>
                    )}
                    {details.financialYear && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Financial Year:</span>
                        <span className="font-medium">
                          {details.financialYear}
                        </span>
                      </div>
                    )}
                    {details.formReference && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Form Reference:</span>
                        <span className="font-medium">
                          {details.formReference}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {details.totalEarnings && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Income Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Earnings:</span>
                        <span className="font-medium">
                          {details.totalEarnings}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Deductions:</span>
                        <span className="font-medium">
                          {details.totalDeductions}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-gray-800 font-medium">
                          Net Taxable Income:
                        </span>
                        <span className="font-bold">
                          {details.netTaxableIncome}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-800 font-medium">
                          Tax Paid:
                        </span>
                        <span className="font-bold text-red-600">
                          {details.taxPaid}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {details.submissionMethod && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-3">
                    Submission Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Submission Method:</span>
                      <span className="font-medium">
                        {details.submissionMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Contact Person:</span>
                      <span className="font-medium">
                        {details.contactPerson}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Contact Email:</span>
                      <span className="font-medium">
                        {details.contactEmail}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );

        case "Policy":
          return (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Policy Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Policy Reference:</span>
                    <span className="font-medium">
                      {details.policyReference}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effective Date:</span>
                    <span className="font-medium">{details.effectiveDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approved By:</span>
                    <span className="font-medium">{details.approvedBy}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="text-sm font-medium text-purple-800 mb-3">
                  Key Changes
                </h3>
                <div className="space-y-2">
                  {details.keyChanges &&
                    details.keyChanges.map((change, index) => (
                      <div key={index} className="flex">
                        <Check className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                        <span className="text-purple-900">{change}</span>
                      </div>
                    ))}
                </div>
              </div>

              {details.policyDocument && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-gray-500 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {details.policyDocument}
                      </h3>
                      <p className="text-sm text-gray-500">Policy Document</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Download
                  </button>
                </div>
              )}
            </div>
          );

        default:
          return (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{selectedNotice.message}</p>
            </div>
          );
      }
    };

    return (
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={closeNoticeForm}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to notices
        </button>

        {/* Notice header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <span
                    className={getCategoryBadgeClasses(selectedNotice.category)}
                  >
                    {selectedNotice.category}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {selectedNotice.date}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mt-1">
                  {selectedNotice.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Notice details */}
          <div className="p-6">
            <p className="text-gray-700 mb-6">{selectedNotice.message}</p>

            {renderFormContent()}
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between">
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded">
                <Mail className="h-4 w-4 mr-1.5" />
                Forward
              </button>
              <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded">
                <Printer className="h-4 w-4 mr-1.5" />
                Print
              </button>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {showForm ? renderNoticeForm() : renderNoticeList()}
    </div>
  );
}