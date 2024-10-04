import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/selectuser.css";
import Button from "react-bootstrap/Button";
import logo from "../assets/logo.png";
import Spinner from "../componets/Spinner";

const SelectUser = () => {
  const [loading, setLoading] = useState(false); // State to manage loading
  const [activeButton, setActiveButton] = useState(null); // State to track which button is clicked
  const navigate = useNavigate();

  const handleNavigation = (path, role, button) => {
    setActiveButton(button); // Set clicked button
    setLoading(true); // Start spinner
    setTimeout(() => {
      navigate(path, { state: { role } }); // Navigate after delay
      setLoading(false); // Stop spinner
    }, 1000);
  };

  return (
    <div className="container-selectuser">
      <div className="content-selectuser">
        <img src={logo} alt="logo" />
        <h2>President Ramon Magsaysay State University</h2>
        <p>CAMPUS ROOM STATUS DASHBOARD TRACKER SYSTEM</p>
        <p>Iba Campus</p>
        <div className="buttons">
          <Button
            variant="secondary"
            className={`btn-selectuser ${
              activeButton === "Program Chair" ? "btn-selectuser-active" : ""
            }`}
            onClick={() =>
              handleNavigation("/login", "Program Chair", "Program Chair")
            }
          >
            PROGRAM CHAIR
          </Button>
          <Button
            variant="secondary"
            className={`btn-selectuser ${
              activeButton === "Teacher" ? "btn-selectuser-active" : ""
            }`}
            onClick={() =>
              handleNavigation("/login", "Instructor", "Instructor")
            }
          >
            INSTRUCTOR
          </Button>
          <Button
            variant="secondary"
            className={`btn-selectuser ${
              activeButton === "Student" ? "btn-selectuser-active" : ""
            }`}
            onClick={() => handleNavigation("/student", null, "Student")}
          >
            STUDENT
          </Button>
        </div>
      </div>
      {loading && <Spinner />}
    </div>
  );
};

export default SelectUser;
