import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../Navbar";
import checkAuth from "../Authentication/checkAuth";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ViewTourPackage.css";

function ViewTourPackage() {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [numParticipants, setNumParticipants] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tourStartDate, setTourStartDate] = useState("");
  const [tourEndDate, setTourEndDate] = useState("");
  const [minTourStartDate, setMinTourStartDate] = useState("");
  const [dateError, setDateError] = useState(false);
  const [bookingTime, setBookingTime] = useState("");
  const [quantity, setQuantity] = useState(1);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.userId;

  useEffect(() => {
    const fetchTourPackageData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/place/${postId}/`,
          {
            headers: {
              Authorization: `Token ${user?.token}`,
            },
          }
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching tour package:", error);
      }
    };

    fetchTourPackageData();
  }, [postId, user?.token]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const pricePerParticipant = parseFloat(post.price || 0);
      setTotalPrice(pricePerParticipant * numParticipants);
    };

    calculateTotalPrice();
  }, [numParticipants, post.price]);

  useEffect(() => {
    if (post.available_from) {
      const availableDate = new Date(post.available_from);
      availableDate.setDate(availableDate.getDate() + 1);
      setMinTourStartDate(availableDate.toISOString().split("T")[0]);
    }
  }, [post.available_from]);

  const handleBooking = async () => {
    if (!tourStartDate || !tourEndDate || !bookingTime || !quantity) {
      setDateError(true);
      return;
    }

    const bookingId = Math.floor(10000000 + Math.random() * 90000000).toString();
    const bookingDate = new Date().toISOString().split("T")[0];

    const bookingData = {
      booking_id: bookingId,
      user: userId,
      tour_package: postId,
      booking_date: bookingDate,
      booking_time: bookingTime,
      quantity: quantity,
      participants: generateParticipants(numParticipants),
      tour_start_date: tourStartDate,
      tour_end_date: tourEndDate,
      total_price: totalPrice,
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/accept-booking/${postId}/`,
        bookingData,
        {
          headers: {
            Authorization: `Token ${user?.token}`,
          },
        }
      );
      console.log("Booking created successfully:", response.data);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const generateParticipants = (numParticipants) => {
    let participants = [];
    for (let i = 1; i <= numParticipants; i++) {
      participants.push(`PARTICIPANT ${i}`);
    }
    return participants.join(", ");
  };

  // RazorPay

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const makePayment = async () => {
    const formData = new FormData();
    formData.append("price", totalPrice);
    formData.append("product_name", post.title);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/new-payment/",
        formData,
        {
          headers: {
            Authorization: `Token ${user?.token}`,
          },
        }
      );

      const res = response.data;
      const options = {
        key: res.razorpay_key,
        amount: res.order.amount,
        currency: res.order.currency,
        callback_url: res.callback_url,
        prefill: {
          email: user?.email || "testemail@test.com",
          contact: user?.phone || "1234567890",
        },
        name: res.product_name,
        order_id: res.order.id,
        handler: function (response) {
          handleBooking();
          const bookingId = response.razorpay_order_id;
          const modal = document.createElement("div");
          modal.className = "modal";
          modal.innerHTML = `<div class="modal-content">
                                <span class="close">
                                  <button class="btn btn-danger">X</button>
                                </span>
                                <h2>Booking Confirmed</h2>
                                <p>Your Order ID is: ${bookingId}</p>
                              </div>`;
          document.body.appendChild(modal);

          modal.querySelector(".close").addEventListener("click", function () {
            document.body.removeChild(modal);
            window.location.href = "/dashboard";
          });
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid fullbody">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-header text-center bg-info text-white">
                <h3>{post.title}</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-5">
                    <Slider dots={true}>
                      <img src={post.picture} alt={post.title} />
                      {post.participants && (
                        <iframe
                          title="Participants"
                          width="560px"
                          height="450px"
                          src={post.participants}
                          frameBorder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      )}
                    </Slider>
                  </div>

                  <div className="col-md-7">
                    <p>{post.description}</p>
                    <div className="static">
                      <p>
                        <strong>Location :</strong> {post.destination}
                      </p>
                      <p>
                        <strong>Available From :</strong> {post.start_date}
                      </p>
                      <p>
                        <strong>Availability :</strong>{" "}
                        {post.availability ? "Yes" : "Not available"}
                      </p>
                      <p>
                        <strong>Price :</strong> {post.price}
                      </p>
                    </div>

                    {post.availability && (
                      <>
                        <div style={{ display: "flex" }}>
                          <label style={{ paddingTop: "5px" }}>
                            <strong>Tour Start Date 
                            &nbsp;</strong>
                          </label>
                          <input
                            type="date"
                            className={`form-control ${
                              dateError ? "is-invalid" : ""
                            }`}
                            value={tourStartDate}
                            min={minTourStartDate}
                            onChange={(event) => {
                              setTourStartDate(event.target.value);
                              setDateError(false);
                            }}
                          />
                          <label style={{ paddingTop: "5px" }}>
                            <strong>&nbsp;Tour End Date :</strong>
                          </label>
                          <input
                            type="date"
                            className={`form-control ${
                              dateError ? "is-invalid" : ""
                            }`}
                            value={tourEndDate}
                            min={minTourStartDate}
                            onChange={(event) => {
                              setTourEndDate(event.target.value);
                              setDateError(false);
                            }}
                          />
                          {dateError && (
                            <div className="invalid-feedback">
                              Please select both start and end dates.
                            </div>
                          )}
                        </div>
                        <br />
                        <br />
                        <div className="logic">
                          <div
                            className="btn-group counter"
                            role="group"
                            aria-label="Participants"
                          >
                            <button
                              className="btn btn-secondary"
                              onClick={() =>
                                setNumParticipants(numParticipants - 1)
                              }
                              disabled={numParticipants <= 1}
                            >
                              -
                            </button>
                            <button className="btn btn-light" disabled>
                              {numParticipants}
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() =>
                                setNumParticipants(numParticipants + 1)
                              }
                              disabled={numParticipants >= 10}
                            >
                              +
                            </button>
                          </div>
                          <div>
                            <label className="mt-2" style={{display: "block"}}>
                              <strong>Booking Time:</strong>
                            </label>
                            <input
                              type="time"
                              className="form-control"
                              value={bookingTime}
                              onChange={(event) => setBookingTime(event.target.value)}
                            />
                          </div>
                          <div>
                            <label className="mt-2" style={{display: "block"}}>
                              <strong>Quantity:</strong>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={quantity}
                              onChange={(event) => setQuantity(event.target.value)}
                              min="1"
                              max="10"
                            />
                          </div>
                          <p>
                            <strong>Total Price :</strong>
                            Rs. {totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-footer text-center">
                {post.availability && (
                  <div>
                    <button
                      className="btn btn-info"
                      onClick={makePayment}
                      disabled={!tourStartDate || !tourEndDate || !bookingTime || !quantity}
                    >
                      Book Tour
                    </button>
                  </div>
                )}
                {!post.availability && (
                  <button className="btn btn-info" disabled>
                    Tour Not Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default checkAuth(ViewTourPackage);

