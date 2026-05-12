import "./CreateBooth.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreateBooth() {
  const handleCreateBooth = async () => {

  try {

    const res = await axios.post(
      "http://localhost:1000/api/booths/create",
      form,
      { withCredentials: true }
    );

    toast.success(res.data.message);

    // reset form
    setForm({
      title: "",
      category: "",
      description: "",
      location: "",
      email: "",
    });

    // redirect
    navigate("/exhibitor/my-booth");

  } catch (error) {

    toast.error(
      error.response?.data?.message || "Failed to create booth"
    );

  }

};

  const navigate = useNavigate();

const [form, setForm] = useState({
  title: "",
  category: "",
  description: "",
  location: "",
  email: "",
});
  return (
    <div className="create-booth">

      {/* HEADER */}
      <div className="booth-header">
        <h1>
          🚀 Create <span>Booth</span>
        </h1>
        <p>
          Build your premium exhibitor booth and showcase it in the EventSphere expo system.
        </p>
      </div>

      {/* GRID */}
      <div className="booth-grid">

        {/* FORM CARD */}
        <div className="premium-card">

          <h2 className="form-title">Booth Details</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Booth Name</label>
              <input type="text" placeholder="Enter booth name" name="title" value={form.title} onChange={(e)=>setForm({...form, [e.target.name]: e.target.value})}/>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={(e)=>setForm({...form, [e.target.name]: e.target.value})}>
                <option>Technology</option>
                <option>Design</option>
                <option>Business</option>
                <option>Healthcare</option>
                <option>Environment</option>
              </select>
            </div>

            <div className="form-group full">
              <label>Description</label>
              <textarea placeholder="Describe your booth..."   name="description"
  value={form.description}
  onChange={(e) =>
    setForm({ ...form, [e.target.name]: e.target.value })
  }/>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input type="text" placeholder="Hall A" name="location"
  value={form.location}
  onChange={(e) =>
    setForm({ ...form, [e.target.name]: e.target.value })
  }/>
            </div>

            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" placeholder="example@mail.com" name="email"
  value={form.email}
  onChange={(e) =>
    setForm({ ...form, [e.target.name]: e.target.value })
  }/>
            </div>

          </div>



          <button className="create-btn" onClick={handleCreateBooth}>
            🚀 Create Booth
          </button>

        </div>

        {/* PREVIEW CARD */}
        <div className="premium-card preview-card">

          <div className="preview-banner">
            <span className="preview-badge">Live Preview</span>
          </div>

          <h3 className="preview-title">Your Booth Preview</h3>

          <p className="preview-desc">
            This preview updates how your booth will appear in the expo system.
          </p>

          <div className="preview-info">

            <div className="preview-box">
              <h4>Category</h4>
              <p>Technology</p>
            </div>

            <div className="preview-box">
              <h4>Location</h4>
              <p>Hall A</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}