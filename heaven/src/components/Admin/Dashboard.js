import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import TourPackageListItem from "./PackageListItem";
import { checkAdmin } from "../Authentication/checkAdmin";

function ListTourPackages() {
  const [tourPackages, setTourPackages] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const fetchTourPackages = useCallback(async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/list/", {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });
      setTourPackages(response.data);
    } catch (error) {
      console.error("Error fetching tour packages:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.token) {
      fetchTourPackages();
    }
  }, [fetchTourPackages, user]);

  const handleRefresh = () => {
    fetchTourPackages();
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center my-4">Tour Package Inventory</h1>
          </div>
        </div>
        <div className="container d-flex justify-content-center align-items-center">
          <Link to="/admin/create" className="btn btn-dark mb-4">
            Add Tour Package
          </Link>
        </div>
        <div className="d-flex flex-wrap">
          {tourPackages.map((tourPackage) => (
            <div key={tourPackage.id}>
              <TourPackageListItem
                packageItem={tourPackage}
                refresh={handleRefresh}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default checkAdmin(ListTourPackages);
