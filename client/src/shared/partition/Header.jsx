import React, { useState } from "react"; // Added useState import
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
      <Button
        variant="secondary"
        className="logout-btn"
        onClick={handleLogout} // Correct function call here
      >
        <img src={logout} alt="Logout" />
      </Button>
      {loading && <Spinner />}
    </header>
  );
};

export default Header;
