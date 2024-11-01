import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import "../../styles/header.css";
import logo from "../../assets/logo.png";
import logout from "../../assets/logout.png";
import editAcc from "../../assets/edit-account.png";
import { Button, Form, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import Spinner from "../../componets/Spinner";
import { useNavigate } from "react-router-dom";

const Header = () => {
  // for modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // user data
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));

  // account state
  // navigation state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // state to handle edit account
  const [selectedID, setSelectedID] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedPassword, setSelectedPassword] = useState("");

  // fetch the data into database
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        let response;
        if (user.programchair_id) {
          response = await fetch(
            `http://localhost:5000/api/user/${user.programchair_id}`
          );
        } else if (user.instructor_id) {
          response = await fetch(
            `http://localhost:5000/api/user/${user.instructor_id}`
          );
        }

        if (response && response.ok) {
          const data = await response.json();
          setSelectedID(data.user_id);
          setSelectedName(data.name);
          setSelectedUsername(data.username);
          setSelectedPassword(data.password);
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
      }
    };

    fetchAccount();
  }, [user.programchair_id, user.instructor_id]);
  // handle submit
  const handleSubmit = () => {
    if (user.instructor_id) {
      const updated = {
        instructorId: selectedID,
        instructorName: selectedName,
        instructorUsername: selectedUsername,
        instructorPassword: selectedPassword,
      };
      fetch(
        `http://localhost:5000/api/update-instructor/${user.instructor_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updated),
        }
      )
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("Failed to update instructor");
        })
        .then(() => {
          toast.success("Instructor account updated successfully!");
          handleClose(); // Close modal
          handleLogout();
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to update account.");
        });
    } else if (user.programchair_id) {
      const updated = {
        instructorId: selectedID,
        instructorName: selectedName,
        instructorUsername: selectedUsername,
        instructorPassword: selectedPassword,
      };
      fetch(
        `http://localhost:5000/api/update-programchair/${user.programchair_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updated),
        }
      )
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("Failed to update instructor");
        })
        .then(() => {
          toast.success("Programchair account updated successfully!");
          handleClose(); // Close modal
          handleLogout();
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to update account.");
        });
    }
  };
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
        {/* chech if there is a account */}
        {!user.course ? (
          <Button
            variant="secondary"
            className="logout-btn me-0"
            onClick={handleShow} // Correct function call here
          >
            <img src={editAcc} alt="Logout" />
          </Button>
        ) : (
          ""
        )}
        <Button
          variant="secondary"
          className="logout-btn ms-0"
          onClick={handleLogout} // Correct function call here
        >
          <img src={logout} alt="Logout" />
        </Button>
      </div>
      {/* edit account modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ID"
                readOnly
                value={selectedID}
                onChange={(e) => setSelectedID(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                value={selectedUsername}
                onChange={(e) => setSelectedUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Password"
                value={selectedPassword}
                onChange={(e) => setSelectedPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {loading && <Spinner />}
    </header>
  );
};

export default Header;
