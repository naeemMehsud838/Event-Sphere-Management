import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import  "./Register.css"

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee",
    company: "",
    phone: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const res = await axios.post(

      "http://localhost:1000/api/auth/register",

      form,

      {
        withCredentials: true,
      }
    );

    toast.success(res.data.message);

    console.log(res.data);

    // RESET FORM
    setForm({
      name: "",
      email: "",
      password: "",
      role: "attendee",
      company: "",
      phone: "",
    });

    // ROLE BASED REDIRECT
    if (form.role === "admin") {
      navigate("/admin");
    }

    else if (form.role === "exhibitor") {
      navigate("/exhibitor");
    }

    else {
      navigate("/attendee");
    }

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Registration Failed"
    );

  }
};
  return (
    <>
      <div className="register-container">
        <div className="register-card-wrapper">
          
          {/* HEADER */}
          <div className="register-header">
            <h2 className="register-title">Join EventSphere</h2>
            <p className="register-subtitle">
              Create your account & start managing expos
            </p>
          </div>

          {/* CARD */}
          <div className="register-card">
            
            {/* ROLE SELECTOR */}
            <div className="role-selector">
              {["attendee", "exhibitor", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`role-btn ${form.role === r ? "active" : ""}`}
                  onClick={() => setForm({ ...form, role: r })}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="register-form">
              
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="input-field"
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="input-field"
              />

              {(form.role === "exhibitor" || form.role === "admin") && (
                <input
                  name="company"
                  placeholder="Company Name"
                  value={form.company}
                  onChange={handleChange}
                  className="input-field"
                />
              )}

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
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
                Create Account
              </button>
            </form>
          </div>

          {/* FOOTER */}
          <p className="register-footer">
            Already have an account?{" "}
            <Link to="/login" className="register-link">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </>
  );
}

export default Register;