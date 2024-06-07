import React from "react";
import "./TourPackageListUser.css";
import checkAuth from "../Authentication/checkAuth";

function TourPackageListUser({ tourPackage }) {
  return (
    <div className="tour-package" key={tourPackage.id}>
      <div className="heading">
        <h2>{tourPackage.title}</h2>
      </div>
      <div className="availability-date">
        Available from :&nbsp;<strong>{tourPackage.available_from}</strong>
      </div>
      <div className="photo">
        <img
          src={
            tourPackage.image !== "N/A"
              ? tourPackage.image
              : "https://via.placeholder.com/400"
          }
          alt={tourPackage.title}
        />
      </div>
      <div className="details">
        <div className="price">
          Rs : <b>{tourPackage.price}</b>
        </div>
        <div className="location-container">
          <div className="location"><b>{tourPackage.location}</b></div>
        </div>
      </div>
    </div>
  );
}

export default checkAuth(TourPackageListUser);
