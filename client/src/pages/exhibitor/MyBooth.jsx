import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./MyBooth.css";
import { useNavigate } from "react-router-dom";

const Search = () => <span>🔍</span>;
const Filter = () => <span>⚙️</span>;
const MapPin = () => <span>📍</span>;
const Star = () => <span>⭐</span>;

const booths = [
  { id: 1, name: "Tech Innovators", category: "Technology", rating: 4.8 },
  { id: 2, name: "Creative Studio", category: "Design", rating: 4.6 },
  { id: 3, name: "AI Lab", category: "AI", rating: 4.9 },
  { id: 4, name: "Startup Hub", category: "Business", rating: 4.7 },
  { id: 5, name: "Green Future", category: "Environment", rating: 4.5 },
  { id: 6, name: "Health Zone", category: "Healthcare", rating: 4.6 },
];

export default function Booth() {
  const navigate = useNavigate();
  const [booths, setBooths] = useState([]);
  const [search, setSearch] = useState("");

  const fetchBooths = async () => {

  try {

    const res = await axios.get(
      "http://localhost:1000/api/booths"
    );

    console.log(res.data);

    setBooths(res.data.booths);

  } catch (error) {

    console.log(error);

  }

};
useEffect(() => {
  fetchBooths();
}, []);

const filteredBooths = booths.filter((booth) =>
  booth.title.toLowerCase().includes(search.toLowerCase())
);
  return (
    <div className="booth-page">

      {/* HEADER */}
      <motion.div
        className="booth-header1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>🚀 Expo Booths</h1>
        <p>Discover innovation, creativity & technology in one place</p>

        <div className="booth-actions">
          <div className="search-box">
            <Search />
<input
  placeholder="Search booths..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>          </div>

          <button className="filter-btn">
            <Filter /> Filter
          </button>
        </div>
      </motion.div>

      {/* GRID */}
      <div className="booth-grid">
        {filteredBooths.map((booth, i) => (
          <motion.div
            key={booth._id}
            className="booth-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -8 }}
          >

            {/* TOP BANNER */}
            <div className="card-banner">
              <span className="category">
                {booth.category}
              </span>
            </div>

            {/* CONTENT */}
            <div className="card-content">
              <h2>{booth.title}</h2>

              <p className="description">
                Explore cutting-edge ideas and connect with industry experts.
              </p>

              {/* META */}
              <div className="booth-footer">
                <div className="rating">
                  <Star /> {booth.rating}
                </div>

                <div className="location">
                  <MapPin /> Hall A
                </div>
              </div>

              {/* BUTTON */}
              <motion.button
                className="visit-btn"
                onClick={() => navigate(`/exhibitor/booth/${booth._id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Visit Booth →
              </motion.button>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
}