
import { useSelector } from "react-redux";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import "./YourBooking.css";
import checkAuth from "../Authentication/checkAuth";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [packageTitles, setPackageTitles] = useState({});
  const [packageImages, setPackageImages] = useState({});
  const [qrCodes, setQrCodes] = useState({});
  const user = useSelector((store) => store.auth.user);

  const fetchQRCodes = useCallback(async () => {
    const qrCodes = {};
    for (const booking of bookings) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/booking/${booking.booking_id}/qr/`
,
          { headers: { Authorization: "Token " + user.token } }
        );
        qrCodes[booking.booking_id] = response.data.qr_image_url;
      } catch (error) {
        console.error("Error fetching QR code:", error);
        qrCodes[booking.booking_id] = null;
      }
    }
    setQrCodes(qrCodes);
  }, [bookings, user]);

  useEffect(() => {
    const fetchPackageDetails = async (packageId) => {
      try {

        const response = await axios.get(
          `http://127.0.0.1:8000/api/listsingle/${packageId}/`,
          { headers: { Authorization: "Token " + user.token } }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching package details:", error);
        return null;
      }
    };

    console.log(user.token);
    axios
      .get("http://127.0.0.1:8000/api/user/bookings/", {
        headers: { Authorization: "Token " + user.token },
      })
      .then(async (response) => {
        setBookings(response.data);

        const titles = {};
        const images = {};
        for (const booking of response.data) {
          const packageId = booking.tour_package;
          const packageDetails = await fetchPackageDetails(packageId);
          if (packageDetails) {
            titles[packageId] = packageDetails.title;
            images[packageId] = packageDetails.image;
          }
        }
        setPackageTitles(titles);
        setPackageImages((prevImages) => ({ ...prevImages, ...images }));
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, [user]);

  useEffect(() => {
    fetchQRCodes();
  }, [fetchQRCodes]);

  return (
    <div>
      <Navbar />
      <br />
      <h2 className="text-center mt-3">Your Bookings</h2>
      <br />
      {bookings.length === 0 ? (
        <p className="text-center">You haven't booked any tour packages yet.</p>
      ) : (
        <ul className="col-14">
          {bookings.map((booking, index) => (
            <li key={index} className="booking-card">
              <div className="package-image">
                <div className="package-title">
                  <h3>{packageTitles[booking.tour_package]}</h3>
                </div>
                {packageImages[booking.tour_package] && (
                  <img
                    src={packageImages[booking.tour_package]}
                    alt={packageTitles[booking.tour_package]}
                  />
                )}
              </div>
              <div className="package-details">
                <div className="booking-id">
                  <p>
                    Booking ID : <strong>#{booking.booking_id}</strong>
                  </p>
                </div>
                <div className="package-start-date">
                  <p>Tour Start Date : {booking.tour_start_date}</p>
                </div>
                <div className="package-end-date">
                  <p>Tour End Date : {booking.tour_end_date}</p>
                </div>
                <div className="booking-date">
                  <p>Booking Date : {booking.booking_date}</p>
                </div>
                <div className="booking-time">
                  <p>Booking Time : {booking.booking_time}</p>
                </div>
                <div className="number-of-persons">
                  <p>Number of Persons : {booking.quantity}</p>
                </div>
                <div className="total-amount">
                  <p>
                    Total Amount : <strong>Rs. {booking.total_price}</strong>
                  </p>
                </div>
              </div>
              <div className="pdf-download">
                <button
                  className="btn btn-outline-dark"
                  onClick={() =>
                    window.open(
                      `http://127.0.0.1:8000/media/booking_pdfs/booking_${booking.booking_id}.pdf`
                    )
                  }
                >
                  Download as PDF
                </button>
              </div>
              <div className="qr-code qr-code-right">
                <p>
                  <b className="me">Scan to find Booking Details</b>
                </p>
                <img
                  src={qrCodes[booking.booking_id]}
                  alt={`QR Code for Booking ID ${booking.booking_id}`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default checkAuth(MyBookings);
