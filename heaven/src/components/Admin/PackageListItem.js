import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./PackageListItem.css"; // Ensure you create and style this CSS file
import { checkAdmin } from "../Authentication/checkAdmin";

function PackageListItem({ packageItem, refresh }) {
  const user = useSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/delete/${packageItem.id}/`, {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      })
      .then((response) => {
        refresh();
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error deleting tour package:", error);
      });
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Check if packageItem is undefined before rendering
  if (!packageItem) {
    return null; // Or any other placeholder or loading indicator
  }

  return (
    <>
      <div className="package">
        <div className="heading">
          <h2>{packageItem.title}</h2>
        </div>
        <div className="photo">
          <img
            src={
              packageItem.image !== "N/A"
                ? packageItem.image
                : "https://via.placeholder.com/400"
            }
            alt={packageItem.title}
          />
        </div>
        <div className="button text-center">
          <Link
            to={`/admin/edit/${packageItem.id}`}
            className="btn btn-primary edit"
          >
            Edit
          </Link>
          <button className="btn btn-danger delete" onClick={openModal}>
            Delete
          </button>
        </div>
      </div>
      <br />

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this tour package?</p>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default checkAdmin(PackageListItem);
