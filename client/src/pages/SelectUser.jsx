import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/selectuser.css";
import { Row, Col, Form, InputGroup, Alert } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import logo from "../assets/logo.png";
import Spinner from "../componets/Spinner";
import { toast } from "react-toastify";
import "../styles/responsive/selectuser.css";

const SelectUser = () => {
  // handle the modatl
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // state to store data
  const [courseData, setCourseData] = useState([]);
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [studentID, setstudentID] = useState("");
  const [file, setFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState("");

  const navigate = useNavigate();
  // fetch the course in the database
  useEffect(() => {
    fetch("http://localhost:5000/api/course")
      .then((response) => response.json())
      .then((data) => setCourseData(data))
      .catch((error) => console.error("Error fetching course data:", error));
  }, []);
  // handle the navigation and the role
  const handleNavigation = (path, role, button) => {
    setActiveButton(button);
    navigate(path, { state: { role } });
  };
  // handle change
  const handleCourse = (eventKey) => setCourse(eventKey);
  const handleYear = (eventKey) => setYear(eventKey);
  const handleSection = (eventKey) => setSection(eventKey);

  const handleCorChange = (e) => setstudentID(e.target.value);
  const handleFileChange = (e) => setFile(e.target.files[0]);
  // handle the verification
  const handleVerify = async () => {
    if (!file) {
      setVerificationResult("Please upload a PDF file.");
      toast.error("Please upload a PDF file.");
      return;
    }
    if (!studentID) {
      setVerificationResult("Please enter a Student ID.");
      toast.error("Please enter Student ID.");
      return;
    }
    if (!course && !year && !section) {
      setVerificationResult("Please select a course, year, and section.");
      toast.error("Please select a course, year, and section.");
      return;
    }
    let convertCourseYearSection = "";
    if (course == "BS Information Technology") {
      convertCourseYearSection = "BSINFOTECH";
    } else {
      convertCourseYearSection = course.toUpperCase().replace(/\s+/g, "");
    }
    convertCourseYearSection =
      convertCourseYearSection + " " + year[0] + section[0];
    try {
      const formData = new FormData();
      formData.append("pdfFile", file);
      fetch("http://localhost:5000/api/verify-cor", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const isStudIDPresent = data.includes(studentID);
          const isCourseYearSecPresent = data.includes(
            convertCourseYearSection
          );

          if (isStudIDPresent && isCourseYearSecPresent) {
            setVerificationResult("Verification Sucessfully.");
            toast.success("Verification Sucessfully.");
          } else {
            setVerificationResult("Verification Failed.");
            toast.error("Verification Failed.");
          }
        });
    } catch (error) {
      setVerificationResult("Error reading PDF file.");
      toast.error("Error reading PDF file.");
    }
  };
  // handle the navigation to different pages
  const handleNavigationStudent = (e) => {
    e.preventDefault();
    if (course === "" || year === "" || section === "") {
      toast.error("Please fill all the fields");
      return;
    }
    if (verificationResult != "Verification Sucessfully.") {
      toast.error("Please verify the COR code before proceeding.");
      return;
    }

    const studentData = { course, year, section };
    localStorage.setItem("userData", JSON.stringify(studentData));
    setLoading(true);
    setTimeout(() => {
      navigate("/student", { state: { userData: studentData } });
      setLoading(false);
      toast.success("Login successfully!");
      handleClose();
    }, 1000);
  };

  return (
    <div className="container-selectuser">
      <div className="content-selectuser responsive-selectuser-content">
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
              handleNavigation("/login", "ProgramChair", "ProgramChair")
            }
          >
            PROGRAMCHAIR
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
                  {courseData.map((item) => (
                    <Dropdown.Item
                      key={item.course_id}
                      eventKey={item.course_name}
                    >
                      {item.course_name}
                    </Dropdown.Item>
                  ))}
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
          <Row>
            <Col>
              <div>
                <h4>Verify Your COR Code</h4>
                <Form.Group controlId="studentID" className="mb-3">
                  <Form.Label>Enter your Student ID</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={studentID}
                      onChange={handleCorChange}
                      placeholder="Enter your Student ID:"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="studentID" className="mb-3">
                  <Form.Label>Upload COR file</Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <Button variant="primary" onClick={handleVerify}>
                  Verify COR
                </Button>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleNavigationStudent}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
      {loading && <Spinner />}
    </div>
  );
};

export default SelectUser;
