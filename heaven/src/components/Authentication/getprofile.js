import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import "./box.css";

function GetProfile() {
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.user.token);

  useEffect(() => {
    if (!token) {
      setErrorMessage("No token found, please log in again.");
      setLoading(false);
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/profile/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.data) {
          setErrorMessage(
            error.response.data.error || "Failed to fetch profile details."
          );
        } else {
          setErrorMessage("Failed to fetch profile details. Please try again later.");
        }
      });
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div className="alert alert-danger">{errorMessage}</div>;
  }

  return (
    <div>
      <Navbar />
      <br />
      <div className="container container-profile">
        <div className="row">
          <div className="col-8 offset-2">
            <h1 className="text-center">
              <b>Profile</b>
            </h1>
            <br />
            {profile && (
              <div className="profile-details">
                <p><b>Username:</b> {profile.username}</p>
                <p><b>Email:</b> {profile.email}</p>
                <p><b>Password:</b> {profile.password}</p>
                <p><b>Token:</b> {profile.token}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetProfile;
