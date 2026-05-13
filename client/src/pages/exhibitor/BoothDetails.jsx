import { useParams, useNavigate } from "react-router-dom";
import "./BoothDetails.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BoothDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [booth, setBooth] = useState(null);

  // FETCH SINGLE BOOTH
  const fetchBooth = async () => {

    try {

      const res = await axios.get(
        `http://localhost:1000/api/booths/${id}`
      );

      setBooth(res.data.booth);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchBooth();

  }, []);

  // LOADING
  if (!booth) {

    return (
      <div style={{ color: "white" }}>
        Loading...
      </div>
    );

  }

  return (
    <div className="booth-details">

      <div className="booth-card">

        <h1 className="booth-title">
          🏢 {booth.title}
        </h1>

        <span className="booth-category">
          {booth.category}
        </span>

        <p className="booth-info">
          {booth.description}
        </p>

        <div className="rating-box">
          <span>⭐ Rating</span>
          <span>4.8</span>
        </div>

        <p className="location">
          📍 Location: {booth.location}
        </p>

        <p className="location">
          📧 Contact: {booth.email}
        </p>

        <button
          className="back-btn"
          onClick={() => navigate("/exhibitor/my-booth")}
        >
          ← Back to Booths
        </button>

      </div>

    </div>
  );
}