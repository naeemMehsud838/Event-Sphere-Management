import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting login with:", form.email);
      
      const response = await axios.post(
        "http://localhost:1000/api/users/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      console.log("Response data:", response.data);

      const data = response.data;

      // ✅ FIXED: Check status === 1 (not success === true)
      if (data.status === 1 && data.user)  {
        
        // ✅ SAVE TOKEN
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("✅ Token saved:", data.token.substring(0, 50) + "...");
        } else {
          console.error("❌ No token in response!");
          toast.error("No token received");
          setLoading(false);
          return;
        }
        
        // ✅ Save user info
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("✅ User saved:", data.user.email);
        }
        
        // ✅ Verify token was saved
        const savedToken = localStorage.getItem("token");
        console.log("Verification - Token in localStorage:", savedToken ? "YES" : "NO");
        
        toast.success(data.message || "Login successful!");

        // ✅ Role based redirect
        const role = data.user?.role;
        
        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin");
          } else if (role === "exhibitor") {
            navigate("/exhibitor");
          } else {
            navigate("/attendee");
          }
        }, 1000);

      } else {
        toast.error(data.message || "Login failed");
      }

    } catch (error) {
      console.error("Login Error:", error);
      
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(error.response.data?.message || "Login Failed");
      } else if (error.request) {
        toast.error("Cannot connect to server. Make sure backend is running on port 1000");
      } else {
        toast.error("Something went wrong: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-wrapper">
          
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          <div className="login-card">
            <form onSubmit={handleLogin} className="login-form">
              
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="input-field"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="input-field"
              />

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="login-footer">
              Don't have an account?{" "}
              <Link to="/register" className="login-link">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}