import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Table, Container, Row, Col, Card, Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import "../../../styles/dashboard.css";
import { toast } from "react-toastify";

const ViewSchedule = () => {
  // user data
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));
  // states that handle the data
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [selectedSection, setSelectedSection] = useState("Select Section");
  const [groupedSchedules, setGroupedSchedules] = useState({});
  // fetch data form database
  const fetchData = () => {
    fetch("http://localhost:5000/api/view-schedule")
      .then((response) => response.json())
      .then((data) => {
        setFilteredSchedule(
          data.filter((item) => item.course_id == user.course_id)
        );
      })
      .catch((error) => console.error("Error fetching schedules:", error));
  };
  // fetch course data basev on the user
  useEffect(() => {
    fetch(`http://localhost:5000/api/course/${user.course_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCourseData(data);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const groupTheSchedule = (scheduleData) => {
    const filterGroupedSchedules = scheduleData.reduce((acc, item) => {
      const year = item.stud_year;
      const section = item.section;

      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][section]) {
        acc[year][section] = [];
      }
      acc[year][section].push(item);
      return acc;
    }, {});

    setGroupedSchedules(filterGroupedSchedules);
  };

  useEffect(() => {
    groupTheSchedule(filteredSchedule);
  }, [filteredSchedule]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      fetch(`http://localhost:5000/api/delete-schedule/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          fetchData();
          toast.success("Schedule deleted successfully.");
        })
        .catch((error) => console.error(error));
    }
  };

  const handleYearChange = (eventKey) => {
    setSelectedYear(eventKey);
  };

  const handleSectionChange = (eventKey) => {
    setSelectedSection(eventKey);
  };

  const filteredSchedules = Object.keys(groupedSchedules)
    .filter((year) => selectedYear === "Select Year" || year === selectedYear)
    .reduce((yearAcc, year) => {
      const filteredSections = Object.keys(groupedSchedules[year])
        .filter(
          (section) =>
            selectedSection === "Select Section" || section === selectedSection
        )
        .reduce((secAcc, section) => {
          secAcc[section] = groupedSchedules[year][section];
          return secAcc;
        }, {});

      if (Object.keys(filteredSections).length > 0) {
        yearAcc[year] = filteredSections;
      }
      return yearAcc;
    }, {});

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-1">View Schedule</h1>
      <h1 className="text-center mb-4">
        {courseData.length > 0 ? courseData[0].course_name : "Loading..."}
      </h1>
      <Row>
        <Col md={10} className="mx-auto">
          <Row className="mb-4">
            <Col>
              <Dropdown onSelect={handleYearChange}>
                <Dropdown.Toggle
                  id="dropdown-button-year"
                  variant="secondary"
                  className="w-100"
                >
                  {selectedYear || "Select Year"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="1stYear">1st Year</Dropdown.Item>
                  <Dropdown.Item eventKey="2ndYear">2nd Year</Dropdown.Item>
                  <Dropdown.Item eventKey="3rdYear">3rd Year</Dropdown.Item>
                  <Dropdown.Item eventKey="4thYear">4th Year</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>

            <Col>
              <Dropdown onSelect={handleSectionChange}>
                <Dropdown.Toggle
                  id="dropdown-button-section"
                  variant="secondary"
                  className="w-100"
                >
                  {selectedSection || "Select Section"}
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

          {Object.keys(filteredSchedules).map((year) => (
            <div key={year}>
              {Object.keys(filteredSchedules[year]).map((section) => (
                <Card key={section} className="mb-4 shadow-sm card-table">
                  <Card.Header className="bg-primary text-white text-center bg-secondary">
                    <h5 className="mb-0">
                      Year: {year} Section: {section}
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Table striped bordered hover className="table-schedule">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Schedule</th>
                          <th>Instructor</th>
                          <th>Room</th>
                          <th>Day</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSchedules[year][section].map((item) => (
                          <tr key={item.id}>
                            <td>{item.subject_description}</td>
                            <td>{item.time_sched}</td>
                            <td>{item.instructor}</td>
                            <td>{item.room}</td>
                            <td>{item.day_sched}</td>
                            <td className="text-center">
                              <Link to={`edit-schedule/${item.id}`}>
                                <Button
                                  variant="warning"
                                  style={{
                                    fontSize: "0.5rem",
                                    width: "3.5rem",
                                    marginRight: "5px",
                                  }}
                                >
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="danger"
                                onClick={() => handleDelete(item.id)}
                                style={{
                                  fontSize: "0.5rem",
                                  width: "3.5rem",
                                }}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ViewSchedule;
