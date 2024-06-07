import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import TourPackageListUser from "./TourPackageListUser";
import checkAuth from "../Authentication/checkAuth";
import "./dashboard.css";
function ListTourPackagesUser() {
  const [tourPackages, setTourPackages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [noPackagesFound, setNoPackagesFound] = useState(false);

  useEffect(() => {
    const fetchTourPackages = async () => {
      try {
        let apiUrl = "http://127.0.0.1:8000/api/list/";
        if (searchQuery.trim() !== "") {
          apiUrl = `http://127.0.0.1:8000/api/search/${searchQuery}/`;
        }
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        });
        setTourPackages(response.data);
        setNoPackagesFound(response.status === 404 || response.data.length === 0);
      } catch (error) {
        setNoPackagesFound(true);
      }
    };

    if (user && user.token) {
      fetchTourPackages();
    }
  }, [searchQuery, user]);

  return (
    <div>
      <Navbar />
      <br />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <input
              className="form-control"
              type="text"
              placeholder="Search your tour packages here..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
            />
          </div>
        </div>
        {noPackagesFound && (
          <div className="row">
            <div className="text-center col-12 mt-5">
              <h2>No tour packages found</h2>
            </div>
          </div>
        )}
        {!noPackagesFound && (
          <>
            <div className="row">
              <div className="col-12">
                <h1
                  className="text-center my-4"
                  style={{
                    fontSize: "60px",
                    fontWeight: 500,
                    backgroundImage:
                      "linear-gradient(to left, #A230ED, #190087)",
                    color: "transparent",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  Book your Tour Packages Here!!
                </h1>
              </div>
            </div>
            <div className="d-flex flex-wrap">
              {tourPackages.map((tourPackage) => (
                <Link
                  to={`/view/${tourPackage.id}`}
                  key={tourPackage.id}
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                >
                  <div>
                    <TourPackageListUser tourPackage={tourPackage} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default checkAuth(ListTourPackagesUser);
