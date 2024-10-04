import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/login.css";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Spinner from "../componets/Spinner";

const Login = () => {
  const location = useLocation();
  const { role } = location.state || {};

  const [data, setData] = useState({ instructor: [], programchair: [] });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/login")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const instructor = data.instructor.find(
      (i) =>
        i.instructor_username === username && i.instructor_password === password
    );

    const programChair = data.programchair.find(
      (chair) =>
        chair.programchair_username === username &&
        chair.programchair_password === password
    );

    const handleNavigation = (path, userData) => {
      setLoading(true); // Start spinner
      setTimeout(() => {
        navigate(path, { state: { userData } }); // Navigate and pass user data
        setLoading(false); // Stop spinner
      }, 1000); // 1000 ms delay (adjust as needed)
    };

    if (instructor) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userData", JSON.stringify(instructor)); // Save user data in localStorage
      handleNavigation("/instructor", instructor);
      toast.success("Login successfully!");
    } else if (programChair) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userData", JSON.stringify(programChair)); // Save user data in localStorage
      handleNavigation("/programchair", programChair);
      toast.success("Login successfully!");
    } else {
      toast.error("Invalid username or password");
      setErrorMessage("Invalid username or password");
      handleNavigation("/login");
    }
  };

  return (
    <div className="container-login">
      <div className="content-login">
        <img src={logo} alt="logo" />
        <h2>President Ramon Magsaysay State University</h2>
        <p>CAMPUS ROOM STATUS DASHBOARD TRACKER SYSTEM</p>
        <p>Iba Campus</p>
        {role && <h1>{role} Login</h1>}

        <form className="login" onSubmit={handleLogin}>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="input-container">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <i className="icon fa fa-user"></i>
          </div>

          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className="icon fa fa-lock"></i>
          </div>

          <div className="submit-container">
            <Button className="btn-login" type="submit">
              Login
            </Button>
          </div>
        </form>
      </div>
      {loading && <Spinner />}
    </div>
  );
};

export default Login;
