import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../store/profileslice"; // Adjusted for consistency
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./box.css"; // Adjusted for consistency

function UpdateProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.user.token);
 

  function updateUserProfile() {
    axios
     .post("http://127.0.0.1:8000/api/update-user-details/", {
        new_username: username,
        new_email: email,
        new_password: password,
      }, {
        headers: {
          Authorization: `Token ${token}`, // Changed from Bearer to Basic as an example
            'Content-Type': 'application/json', // Adding Content-Type header
          }
      })
     .then((response) => {
        setErrorMessage(""); // Clear any previous error messages
        console.log(response.data);
        // Dispatch an action to update the user profile in your Redux store
        dispatch(updateProfile(response.data.updatedUser)); // Ensure this matches your action creator's expected payload
        navigate('/dashboard'); // Navigate to the dashboard or another page after successful update
      })
     .catch((error) => {
        if (error.response && error.response.data.errors) {
          setErrorMessage(Object.values(error.response.data.errors).join("\n")); // Display multiple errors separated by newline
        } else if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Failed to update profile. Please try again.");
        }
      });
  }

  return (
    <div>
      <Navbar />
      <br />
      <div className="container container-update-profile">
        <div className="row">
          <div className="col-8 offset-2">
            <h1 className="text-center">
              <b>Update Profile</b>
            </h1>
            <br />
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            <div className="form-group">
              <label className="label-white">Username:</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">New Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group text-center">
              <button className="btn btn-primary" onClick={updateUserProfile}>
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;