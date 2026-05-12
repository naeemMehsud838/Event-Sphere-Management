import { useParams,useNavigate } from "react-router-dom";
import "./BoothDetails.css";

export default function BoothDetails() {
    const navigate = useNavigate();
  const { id } = useParams();

  const booths = [
    { id: 1, name: "Tech Innovators", category: "Technology", rating: 4.8 },
    { id: 2, name: "Creative Studio", category: "Design", rating: 4.6 },
    { id: 3, name: "AI Lab", category: "AI", rating: 4.9 },
  ];

  const booth = booths.find((b) => b.id === Number(id));

  if (!booth) {
    return <div style={{ color: "white" }}>Not found</div>;
  }

  return (
    <div className="booth-details">

      <div className="booth-card">

        <h1 className="booth-title">🏢 {booth.name}</h1>

        <span className="booth-category">
          {booth.category}
        </span>

        <p className="booth-info">
          This booth belongs to the {booth.category} category and showcases innovative solutions.
        </p>

        <div className="rating-box">
          <span>⭐ Rating</span>
          <span>{booth.rating}</span>
        </div>

        <p className="location">📍 Location: Hall A</p>

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