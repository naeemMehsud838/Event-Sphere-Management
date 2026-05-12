import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import {toast} from "react-toastify"

export default function Login() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ STATIC SUBMIT
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   console.log("Login Data:", form);

  //   alert("Login submitted (static mode)");

  //   // optional reset
  //   setForm({ email: "", password: "" });
  // };

const handleLogin = async (e) => {
  e.preventDefault();
  console.log("LOGIN HIT")

  try {

    const res = await axios.post(

      "http://localhost:1000/api/auth/login",

      {
        email: form.email,
        password: form.password,
      },

      {
        withCredentials: true,
      }
    );

    toast.success(res.data.message);
    console.log(res.data)

    localStorage.setItem(
  "user",
  JSON.stringify(res.data.user)
);

    if (res.data.user.role === "admin") {
      navigate("/admin");
    } 
    else if (res.data.user.role === "exhibitor") {
      navigate("/exhibitor");
    }
    else if (res.data.user.role === "attendee"){
      navigate("/attendee");
    }
    else {
      navigate("/");
    }

  } catch (error) {
    console.log(error);
    
    toast.error(
      error.response?.data?.message || "Login Failed"
    );

  }

};

  return (
    <>
      <div className="login-container">
        <div className="login-wrapper">
          
          {/* HEADER */}
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          {/* CARD */}
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

              <button type="submit" className="submit-btn">
                Sign In
              </button>
            </form>

            {/* FOOTER */}
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