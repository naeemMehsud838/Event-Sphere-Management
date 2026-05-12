import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function AdminDashboard() {

  // FORM STATE
  const [expoData, setExpoData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    theme: "",
  });

  // ALL EXPOS
  const [expos, setExpos] = useState([]);

  // EDIT MODE
  const [editingId, setEditingId] = useState(null);

  // INPUT CHANGE
  const handleChange = (e) => {

    setExpoData({
      ...expoData,
      [e.target.name]: e.target.value,
    });

  };

  // FETCH ALL EXPOS
  const fetchExpos = async () => {

    try {

      const res = await axios.get(
        "http://localhost:1000/api/expos"
      );

      setExpos(res.data.expos);

    } catch (error) {

      console.log(error);

      toast.error("Failed to fetch expos");

    }
  };

  // CREATE EXPO
  const handleCreateExpo = async (e) => {

    e.preventDefault();

    try {

      // EDIT MODE
      if (editingId) {

        const res = await axios.put(

          `http://localhost:1000/api/expos/${editingId}`,

          expoData,

          {
            withCredentials: true,
          }
        );

        toast.success(res.data.message);

        setEditingId(null);

      }

      // CREATE MODE
      else {

        const res = await axios.post(

          "http://localhost:1000/api/expos/create",

          expoData,

          {
            withCredentials: true,
          }
        );

        toast.success(res.data.message);

      }

      // REFRESH LIST
      fetchExpos();

      // RESET FORM
      setExpoData({
        title: "",
        description: "",
        date: "",
        location: "",
        theme: "",
      });

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Operation failed"
      );

    }
  };

  // DELETE EXPO
  const handleDelete = async (id) => {

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This expo will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {

      const res = await axios.delete(

        `http://localhost:1000/api/expos/${id}`,

        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message);

      fetchExpos();

    } catch (error) {

      console.log(error);

      toast.error("Delete failed");

    }
  };

  // EDIT EXPO
  const handleEdit = (expo) => {

    setExpoData({
      title: expo.title,
      description: expo.description,
      date: expo.date?.split("T")[0],
      location: expo.location,
      theme: expo.theme,
    });

    setEditingId(expo._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // LOAD EXPOS
  useEffect(() => {
    fetchExpos();
  }, []);

  return (

    <div style={{ padding: "20px" }}>

      <h1>Admin Dashboard</h1>

      {/* FORM */}

      <form onSubmit={handleCreateExpo}>

        <input
          type="text"
          name="title"
          placeholder="Expo Title"
          value={expoData.title}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={expoData.description}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="date"
          name="date"
          value={expoData.date}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={expoData.location}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="theme"
          placeholder="Theme"
          value={expoData.theme}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">

          {
            editingId
              ? "Update Expo"
              : "Create Expo"
          }

        </button>

      </form>

      <hr />

      {/* ALL EXPOS */}

      <h2>All Expos</h2>

      {
        expos.length === 0
          ? (
            <p>No expos found</p>
          )
          : (
            expos.map((expo) => (

              <div
                key={expo._id}
                style={{
                  border: "1px solid gray",
                  padding: "15px",
                  marginBottom: "15px",
                }}
              >

                <h3>
                  {expo.title}
                </h3>

                <p>
                  {expo.description}
                </p>

                <p>
                  <strong>Location:</strong>
                  {" "}
                  {expo.location}
                </p>

                <p>
                  <strong>Theme:</strong>
                  {" "}
                  {expo.theme}
                </p>

                <p>
                  <strong>Date:</strong>
                  {" "}
                  {
                    new Date(expo.date)
                    .toLocaleDateString()
                  }
                </p>

                <button
                  onClick={() => handleEdit(expo)}
                >
                  Edit
                </button>

                {" "}

                <button
                  onClick={() => handleDelete(expo._id)}
                >
                  Delete
                </button>

              </div>

            ))
          )
      }

    </div>
  );
}