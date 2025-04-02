import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "./AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const { register, loading } = useContext(AuthContext);

  const { name, email, password, confirmPassword } = formData;

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() === "" ? "Name is required" : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Invalid email address"
          : "";
      case "password":
        if (value.length < 6) return "Password must be at least 6 characters";
        if (!/[A-Z]/.test(value))
          return "Include at least one uppercase letter";
        if (!/[0-9]/.test(value)) return "Include at least one number";
        return "";
      case "confirmPassword":
        return value !== password ? "Passwords do not match" : "";
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setFormErrors({
      ...formErrors,
      [name]: validateField(name, value),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field if it's been touched
    if (touched[name]) {
      setFormErrors({
        ...formErrors,
        [name]: validateField(name, value),
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", name),
      email: validateField("email", email),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
      general: "",
    };

    setFormErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register(name, email, password);
      window.location.reload(); // Reload the page to reflect the new authentication state
    } catch (err) {
      setFormErrors({
        ...formErrors,
        general: err.message || "Registration failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {formErrors.general && (
          <div
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
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
                <p className="text-sm text-red-700">{formErrors.general}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  formErrors.name && touched.name
                    ? "border-red-300"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Full Name"
                aria-invalid={formErrors.name ? "true" : "false"}
                aria-describedby={formErrors.name ? "name-error" : undefined}
              />
              {formErrors.name && touched.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  formErrors.email && touched.email
                    ? "border-red-300"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                aria-invalid={formErrors.email ? "true" : "false"}
                aria-describedby={formErrors.email ? "email-error" : undefined}
              />
              {formErrors.email && touched.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  formErrors.password && touched.password
                    ? "border-red-300"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                aria-invalid={formErrors.password ? "true" : "false"}
                aria-describedby={
                  formErrors.password ? "password-error" : undefined
                }
              />
              {formErrors.password && touched.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  formErrors.confirmPassword && touched.confirmPassword
                    ? "border-red-300"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm Password"
                aria-invalid={formErrors.confirmPassword ? "true" : "false"}
                aria-describedby={
                  formErrors.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
              />
              {formErrors.confirmPassword && touched.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{" "}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    className="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
