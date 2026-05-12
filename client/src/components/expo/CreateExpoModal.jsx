import { useEffect } from "react";
import "./CreateExpoModal.css";

function CreateExpoModal({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Expo has been created successfully! 🎉");
    onClose();
  };

  return (
    <>


      <div className="cem-overlay" onClick={onClose}>
        <div
          className="cem-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cem-header">
            <h2 className="cem-title">
              Create <span>New Expo</span>
            </h2>
            <button className="cem-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <form className="cem-body" onSubmit={handleSubmit}>
            <div className="cem-grid">
              <div className="cem-field">
                <label className="cem-label">Expo Title</label>
                <input
                  className="cem-input"
                  type="text"
                  placeholder="Enter expo title"
                  required
                />
              </div>

              <div className="cem-field">
                <label className="cem-label">Category</label>
                <select className="cem-select" required>
                  <option value="">Select category</option>
                  <option>Technology</option>
                  <option>Fashion</option>
                  <option>Food</option>
                  <option>Art</option>
                  <option>Business</option>
                  <option>Science</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="cem-field">
                <label className="cem-label">Location</label>
                <input
                  className="cem-input"
                  type="text"
                  placeholder="Expo location"
                  required
                />
              </div>

              <div className="cem-field">
                <label className="cem-label">Ticket Price</label>
                <input
                  className="cem-input"
                  type="number"
                  placeholder="199"
                  step="0.01"
                  required
                />
              </div>

              <div className="cem-field">
                <label className="cem-label">Start Date</label>
                <input className="cem-input" type="date" required />
              </div>

              <div className="cem-field">
                <label className="cem-label">End Date</label>
                <input className="cem-input" type="date" required />
              </div>

              <div className="cem-field full">
                <label className="cem-label">Description</label>
                <textarea
                  className="cem-textarea"
                  placeholder="Describe your expo..."
                  required
                />
              </div>
            </div>

            <div className="cem-actions">
              <button
                type="button"
                className="cem-btn cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="cem-btn save">
                Save Expo
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateExpoModal;