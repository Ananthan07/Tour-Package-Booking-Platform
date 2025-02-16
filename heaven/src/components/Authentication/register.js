
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./box.css";

function Register() {
  var [name, setName] = useState("");
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [passwordConf, setPasswordConf] = useState("");
  var [errorMessage, setErrorMessage] = useState("");
  var navigate = useNavigate();
  function registerUser() {
    var user = {
      username: name,
      email: email,
      password1: password,
      password2: passwordConf,
    };
    axios
      .post("http://127.0.0.1:8000/api/register/", user)
      .then((response) => {
        setErrorMessage("");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response.data.errors) {
          setErrorMessage(Object.values(error.response.data.errors).join(" "));
        } else {
          setErrorMessage("Please Enter valid Input");
        }
      });
  }
  return (
    <div>
      <Navbar />
      <br />
      <div className="container container-login">
        <div className="row">
          <div className="col-8 offset-2">
            <h1 className="text-center">
              <b>Register</b>
            </h1>
            {errorMessage ? (
              <div className="alert alert-danger">{errorMessage}</div>
            ) : (
              ""
            )}
            <br />
            <div className="form-group">
              <label className="label-white">Username : </label>
              <input
                type="text"
                className="form-control"
                value={name}
                onInput={(event) => setName(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">Email : </label>
              <input
                type="text"
                className="form-control"
                value={email}
                onInput={(event) => setEmail(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">Password : </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onInput={(event) => setPassword(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group">
              <label className="label-white">Confirm Password : </label>
              <input
                type="password"
                className="form-control"
                value={passwordConf}
                onInput={(event) => setPasswordConf(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group text-center">
              <button
                className="btn btn-primary"
                onClick={registerUser}
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
