import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";

import { checkAdmin } from "../Authentication/checkAdmin";

function AddTourPackage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availability, setAvailability] = useState(false);
  const [destination, setDestination] = useState("");
  const [picture, setPicture] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [includedMeals, setIncludedMeals] = useState("");
  const [transportationDetails, setTransportationDetails] = useState("");

  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  function addTourPackage() {
    axios
      .post(
        "http://127.0.0.1:8000/api/create/",
        {
          title: title,
          description: description,
          price: price,
          start_date: startDate,
          end_date: endDate,
          availability: availability,
          destination: destination,
          picture: picture,
          itinerary:itinerary,
          included_meals:includedMeals,
          transportation_details: transportationDetails,
        },
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      )
      .then((response) => {
        if (response.data && response.data.message) {
          alert(response.data.message);
        } else {
          alert("Tour package added successfully!");
        }
        navigate("/admin/dashboard");
      })
      .catch((error) => {
        if (error.response) {
          alert(`Error: ${error.response.data.error}`);
        } else if (error.request) {
          alert("No response received from the server");
        } else {
          alert("Error setting up the request");
        }
      });
  }

  return (
    <div>
      <Navbar />
      <br />
      <div className="container">
        <div className="row">
          <div className="col-8 offset-2">
            <h1 className="text-center">Add Tour Package</h1>
            <div className="form-group">
              <label className="label-white">Title :</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
              <br />
            </div>
            <div className="form-group">
              <label className="label-white">Description :</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
                rows="5"
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">Price :</label>
              <input
                type="text"
                className="form-control"
                value={price}
                onChange={(event) => {
                  setPrice(event.target.value);
                }}
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">Start Date :</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                }}
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">End Date :</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(event) => {
                  setEndDate(event.target.value);
                }}
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">Availability :</label>
              &nbsp;
              <input
                type="checkbox"
                style={{
                  verticalAlign: "middle",
                  marginLeft: "5px",
                  width: "20px",
                  height: "20px",
                  border: "2px solid #333",
                  borderRadius: "4px",
                  outline: "none",
                  cursor: "pointer",
                }}
                checked={availability}
                onChange={(event) => {
                  setAvailability(event.target.checked);
                }}
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">Destination :</label>
              <input
                type="text"
                className="form-control"
                value={destination}
                onChange={(event) => {
                  setDestination(event.target.value);
                }}
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">Picture URL :</label>
              <input
                type="url"
                className="form-control"
                value={picture}
                onChange={(event) => {
                  setPicture(event.target.value);
                }}
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">itinerary:</label>
              <textarea
                className="form-control"
                value={itinerary}
                onChange={(event) => {
                  setItinerary(event.target.value);
                }}
                rows="3"
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">includedMeals:</label>
              <textarea
                className="form-control"
                value={includedMeals}
                onChange={(event) => {
                  setIncludedMeals(event.target.value);
                }}
                rows="3"
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">Transportation Details :</label>
              <textarea
                className="form-control"
                value={transportationDetails}
                onChange={(event) => {
                  setTransportationDetails(event.target.value);
                }}
                rows="3"
              />
            </div>
            <br />
            <div className="text-center">
              <button className="btn btn-primary" onClick={addTourPackage}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default checkAdmin(AddTourPackage);
