import React, { useState } from "react";

const Login = ({ onLogin = () => {} }) => {
  const [emailOrId, setEmailOrId] = useState(""); // can be email or employeeId
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Try both keys for compatibility
      const body = emailOrId.includes("@")
        ? { email: emailOrId, password }
        : { employeeId: emailOrId, password };

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Login failed: " + response.statusText
        );
      }

      setTimeout(() => {
        onLogin({
          token: data.token,
          ...data.user,
        });
      }, 800);
    } catch (err) {
      setError(
        err.message === "Invalid credentials"
          ? "Invalid Employee ID/Email or password. Please try again."
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-center text-3xl font-bold text-white">
            Staff Portal
          </h2>
          <p className="mt-2 text-center text-sm text-indigo-200">
            Sign in to access your dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-500/50 p-4 rounded-lg text-white animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-300"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-5">
            <div
              className={`relative transition-all duration-300 ${
                activeField === "emailOrId" ? "transform -translate-y-1" : ""
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-1 1v7a1 1 0 001 1h10a1 1 0 001-1v-7a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm-2 5V6a2 2 0 114 0v1H8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="emailOrId"
                name="emailOrId"
                type="text"
                autoComplete="off"
                required
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                onFocus={() => setActiveField("emailOrId")}
                onBlur={() => setActiveField("")}
                className="appearance-none block w-full pl-10 pr-3 py-3 border-2 border-indigo-300/50 bg-white/10 backdrop-filter backdrop-blur-sm text-white rounded-xl placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                disabled={isLoading}
              />
              <label
                htmlFor="emailOrId"
                className={`absolute left-10 transition-all duration-200 pointer-events-none ${
                  activeField === "emailOrId" || emailOrId
                    ? "-top-2 text-xs bg-indigo-800 px-1 rounded text-indigo-200"
                    : "top-3 text-indigo-300"
                }`}
              >
                Employee ID or Email
              </label>
            </div>

            <div
              className={`relative transition-all duration-300 ${
                activeField === "password" ? "transform -translate-y-1" : ""
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setActiveField("password")}
                onBlur={() => setActiveField("")}
                className="appearance-none block w-full pl-10 pr-10 py-3 border-2 border-indigo-300/50 bg-white/10 backdrop-filter backdrop-blur-sm text-white rounded-xl placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                disabled={isLoading}
              />
              <label
                htmlFor="password"
                className={`absolute left-10 transition-all duration-200 pointer-events-none ${
                  activeField === "password" || password
                    ? "-top-2 text-xs bg-indigo-800 px-1 rounded text-indigo-200"
                    : "top-3 text-indigo-300"
                }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-400 hover:text-indigo-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-400 hover:text-indigo-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white 
              ${
                isLoading
                  ? "bg-indigo-600 animate-pulse"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              } 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-600/30`}
              disabled={isLoading}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-indigo-300 group-hover:text-white transition-colors duration-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
              <span className="ml-2">
                {isLoading ? "Authenticating..." : "Sign in"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Visual elements for modern design */}
      <div className="hidden lg:block absolute top-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="hidden lg:block absolute bottom-10 left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div className="hidden lg:block absolute bottom-40 right-60 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
    </div>
  );
};

export default Login;
