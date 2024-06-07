import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import { checkAdmin } from "../Authentication/checkAdmin";

function EditTourPackage() {
  const { postId } = useParams();
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

  useEffect(() => {
    if (user && user.token) {
      axios
        .get(`http://127.0.0.1:8000/api/listsingle/${postId}/`, {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        })
        .then((response) => {
          setTitle(response.data.title);
          setDescription(response.data.description);
          setPrice(response.data.price);
          setStartDate(response.data.start_date);
          setEndDate(response.data.end_date);
          setAvailability(response.data.availability);
          setDestination(response.data.destination);
          setPicture(response.data.picture);
          setItinerary(response.data.itinerary);
          setIncludedMeals(response.data.included_meals);
          setTransportationDetails(response.data.transportation_details);
        })
        .catch((error) => {
          console.error("Error fetching tour package:", error);
        });
    }
  }, [postId, user]);

  function updateTourPackage() {
    axios
      .put(
        `http://127.0.0.1:8000/api/update/${postId}/`,
        {
          title: title,
          description: description,
          price: price,
          start_date: startDate,
          end_date: endDate,
          availability: availability,
          destination: destination,
          picture: picture,
          itinerary: itinerary,
          included_meals: includedMeals,
          transportation_details: transportationDetails,
        },
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      )
      .then((response) => {
        navigate("/admin/dashboard");
      })
      .catch((error) => {
        console.error("Error updating tour package:", error);
      });
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-8 offset-2">
            <h1 className="text-center">Edit Tour Package</h1>
            <div className="form-group">
              <label>Title :</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <br />
            </div>
            <div className="form-group">
              <label>Description :</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows="5"
              />
            </div>
            <br />
            <div className="form-group">
              <label>Price :</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Start Date :</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group">
              <label>End Date :</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Availability :</label>&nbsp;
              <input
                type="checkbox"
                checked={availability}
                onChange={(event) => setAvailability(event.target.checked)}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Destination :</label>
              <input
                type="text"
                className="form-control"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Picture URL :</label>
              <input
                type="url"
                className="form-control"
                value={picture}
                onChange={(event) => setPicture(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Itinerary :</label>
              <textarea
                className="form-control"
                value={itinerary}
                onChange={(event) => setItinerary(event.target.value)}
                rows="3"
              />
            </div>
            <br />
            <div className="form-group">
              <label>Included Meals :</label>
              <textarea
                className="form-control"
                value={includedMeals}
                onChange={(event) => setIncludedMeals(event.target.value)}
                rows="3"
              />
            </div>
            <br />
            <div className="form-group">
              <label>Transportation Details :</label>
              <textarea
                className="form-control"
                value={transportationDetails}
                onChange={(event) => setTransportationDetails(event.target.value)}
                rows="3"
              />
            </div>
            <br />
            <div className="text-center">
              <button className="btn btn-primary" onClick={updateTourPackage}>
                Submit
              </button>
              &nbsp;&nbsp;&nbsp;
              <Link to={"/admin/dashboard"} className="btn btn-warning">
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default checkAdmin(EditTourPackage);
