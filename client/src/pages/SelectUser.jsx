import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/selectuser.css";
import { Table, Container, Row, Col } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import logo from "../assets/logo.png";
import Spinner from "../componets/Spinner";
import { toast } from "react-toastify";

const SelectUser = () => {
  // handle the modal for the  STUDENTS
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // variable for  STUDENTS data
  const [courseData, setCourseData] = useState([]);
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  // handle the navigation to the different pages based on the role
  const [loading, setLoading] = useState(false); // State to manage loading
  const [activeButton, setActiveButton] = useState(null); // State to track which button is clicked
  const navigate = useNavigate();
  // fetch the course from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/course")
      .then((response) => response.json())
      .then((data) => setCourseData(data))
      .catch((error) => console.error("Error fetching course data:", error));
  }, []);
  // function for handle navigation
  const handleNavigation = (path, role, button) => {
    setActiveButton(button); // Set clicked button
    setLoading(true); // Start spinner
    setTimeout(() => {
      navigate(path, { state: { role } }); // Navigate after delay
      setLoading(false); // Stop spinner
    }, 1000);
  };
  // function for handle navigation for STUDENTS
  const handleNavigationStudent = (e) => {
    e.preventDefault();
    if (course === "" || year === "" || section === "") {
      toast.error("Please fill all the fields");
      return;
    }
    const handleNavigation = (path, userData) => {
      setLoading(true); // Start spinner
      setTimeout(() => {
        navigate(path, { state: { userData } }); // Navigate and pass user data
        setLoading(false); // Stop spinner
      }, 1000); // 1000 ms delay (adjust as needed)
    };
    const studentData = {
      course: course,
      year: year,
      section: section,
    };
    localStorage.setItem("userData", JSON.stringify(studentData)); // Save user data in localStorage
    handleNavigation("/student", studentData);
    toast.success("Login successfully!");
    handleClose();
  };
  // function for students modal for students data
  const handleCourse = (eventKey) => {
    setCourse(eventKey);
  };
  const handleYear = (eventKey) => {
    setYear(eventKey);
  };
  const handleSection = (eventKey) => {
    setSection(eventKey);
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
            onClick={handleShow}
          >
            STUDENT
          </Button>
        </div>
      </div>
      {loading && <Spinner />}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Welcome Students</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Col>
              <Dropdown onSelect={handleCourse}>
                <Dropdown.Toggle
                  id="dropdown-button-year"
                  variant="secondary"
                  className="w-100"
                >
                  {course || "Select Course"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {courseData.map((item) => {
                    return (
                      <Dropdown.Item
                        key={item.course_id}
                        eventKey={item.course_name}
                      >
                        {item.course_name}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Dropdown onSelect={handleYear}>
                <Dropdown.Toggle
                  id="dropdown-button-year"
                  variant="secondary"
                  className="w-100"
                >
                  {year || "Select Year"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="1stYear">1st Year</Dropdown.Item>
                  <Dropdown.Item eventKey="2ndYear">2nd Year</Dropdown.Item>
                  <Dropdown.Item eventKey="3rdYear">3rd Year</Dropdown.Item>
                  <Dropdown.Item eventKey="4thYear">4th Year</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          <Row>
            <Col>
              <Dropdown onSelect={handleSection}>
                <Dropdown.Toggle
                  id="dropdown-button-section"
                  variant="secondary"
                  className="w-100"
                >
                  {section || "Select Section"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="A">Section A</Dropdown.Item>
                  <Dropdown.Item eventKey="B">Section B</Dropdown.Item>
                  <Dropdown.Item eventKey="C">Section C</Dropdown.Item>
                  <Dropdown.Item eventKey="D">Section D</Dropdown.Item>
                  <Dropdown.Item eventKey="E">Section E</Dropdown.Item>
                  <Dropdown.Item eventKey="F">Section F</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleNavigationStudent}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SelectUser;
