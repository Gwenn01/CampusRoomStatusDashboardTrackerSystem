import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "../../styles/header.css";
import logo from "../../assets/logo.png";
import logout from "../../assets/logout.png";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Spinner from "../../componets/Spinner";
import { useNavigate } from "react-router-dom";

const Header = () => {
  // user data
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));

  // navigation state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // handle logout
  const handleLogout = () => {
    setLoading(true); // Start spinner
    setTimeout(() => {
      localStorage.removeItem("token");
      toast.success("Logout Successfully");
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  // Display user-specific data in the header
  const renderUserInfo = () => {
    if (user.programchair_id) {
      // Program Chair
      return (
        <div className="user-info">
          <p>
            Welcome! {user.programchair_id} {user.programchair_name}
          </p>
        </div>
      );
    } else if (user.instructor_id) {
      // Instructor
      return (
        <div className="user-info">
          <p>
            Welcome! {user.instructor_id} {user.instructor_name}
          </p>
        </div>
      );
    } else if (user.course) {
      // Student
      return (
        <div className="user-info">
          <p>
            {user.course} {user.year} {user.section}
          </p>
        </div>
      );
    } else {
      return <p>No user data available</p>;
    }
  };

  return (
    <header className="header-container">
      <Navbar variant="dark">
        <Container>
          <Navbar.Brand className="header-brand">
            <img
              alt="logo"
              src={logo}
              width="40"
              height="40"
              className="d-inline-block align-top"
            />{" "}
            <Navbar.Text className="header-text" style={{ color: "white" }}>
              CAMPUS ROOM STATUS DASHBOARD TRACKER SYSTEM
            </Navbar.Text>
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Logout button */}
      <div className="right-content">
        {/* User-specific info */}
        <div className="user-details">{renderUserInfo()}</div>
        <Button
          variant="secondary"
          className="logout-btn"
          onClick={handleLogout} // Correct function call here
        >
          <img src={logout} alt="Logout" />
        </Button>
      </div>

      {loading && <Spinner />}
    </header>
  );
};

export default Header;
