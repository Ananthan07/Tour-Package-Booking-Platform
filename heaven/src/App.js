
import Navbar from "./components/Navbar";
import { Link } from "react-router-dom";
import"./App.css"
function App() {
  return (
    <div>
      <Navbar />

      <div className="text-center" style={{ marginTop: "150px"}}>
      
      <h1 className="gradient-text">HEAVEN HOLIDAYS</h1>
        
      </div>
      <br />
      <br />
      <div className="text-center">
        <Link to={"/register"} className="btn btn-dark">
          SignUp
        </Link>
        <p style={{ marginTop: "200px" }}>Already have an account?</p>
        <Link to={"/login"}>Login</Link>
      </div>
    </div>
  );
}

export default App;
