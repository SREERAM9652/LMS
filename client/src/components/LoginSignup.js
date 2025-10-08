import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

function LoginSignup({ formType, setIsLoggedIn }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("student");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // React Router navigation
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors before making a request

    if (formType === "signup" && role === "admin") {
      setError("You cannot be an admin.");
      return;
    }
    
    // Signup validation
    if (formType === "signup") {
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      if (!phone.match(/^\d{10}$/)) {
        setError("Please enter a valid 10-digit phone number!");
        return;
      }
    }

    const endpoint = formType === "login" ? "/auth/login" : "/auth/signup";
    const userData = { fullName, email, password, phone, role, dob, gender };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      console.log(`${formType === "login" ? "Logged in" : "Signed up"} successfully!`, data);

      if (formType === "login") {
        // Store userId (studentId) and role in localStorage
        localStorage.setItem("userId", data.user._id); // Store userId (studentId)
        localStorage.setItem("role", data.user.role); // Store user role
        setIsLoggedIn(true);
      }

      if (formType === "signup") {
        // Store user role in localStorage after signup
        localStorage.setItem("role", role);
      }

      navigate("/dashboard"); // Redirect after success
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("API error:", error);
    }
  };

  return (
    <div className="login-signup-container">
      <div className="form-container">
        <h2 className="homepage-title">{formType === "login" ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {formType === "signup" && (
            <>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="auth-input"
                required
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="auth-input"
                required
              />
              <select value={role} onChange={(e) => setRole(e.target.value)} className="auth-input" required>
                <option value="student">Student</option>
                
                <option value="admin" disabled>Admin</option>
              </select>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="auth-input"
                required
              />
              <div className="gender-container">
                <label>Gender:</label>
                <label>
                  <input type="radio" value="Male" name="gender" onChange={(e) => setGender(e.target.value)} required /> Male
                </label>
                <label>
                  <input type="radio" value="Female" name="gender" onChange={(e) => setGender(e.target.value)} required /> Female
                </label>
                <label>
                  <input type="radio" value="Other" name="gender" onChange={(e) => setGender(e.target.value)} required /> Other
                </label>
              </div>
            </>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="auth-input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="auth-input"
            required
          />
          {formType === "signup" && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="auth-input"
              required
            />
          )}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className={`auth-button ${formType === "login" ? "login-button" : "signup-button"}`}>
            {formType === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="toggle-text" onClick={() => navigate(formType === "login" ? "/signup" : "/login")}>
          {formType === "login" ? "Don’t have an account? Sign Up" : "Already have an account? Login"}
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
