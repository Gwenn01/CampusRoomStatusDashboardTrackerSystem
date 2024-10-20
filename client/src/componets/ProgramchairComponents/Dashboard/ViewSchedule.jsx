import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Container, Row, Col, Card, Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import "../../../styles/dashboard.css";
import { toast } from "react-toastify";

const ViewSchedule = () => {
  const [course, setCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]); // New state for filtered schedule
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [selectedSection, setSelectedSection] = useState("Select Section");
  const [groupedSchedules, setGroupedSchedules] = useState({});

  // Function to fetch schedules from the API
  const fetchData = () => {
    fetch("http://localhost:5000/api/view-schedule")
      .then((response) => response.json())
      .then((data) => {
        setSchedule(data);
        setFilteredSchedule(data); // Initialize filtered schedule with full data
      })
      .catch((error) => console.error("Error fetching schedules:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch the course data from the database
  useEffect(() => {
    fetch("http://localhost:5000/api/course")
      .then((response) => response.json())
      .then((data) => setCourse(data))
      .catch((error) => console.error("Error fetching course data:", error));
  }, []);

  // Group schedules by course, year, and section
  const groupTheSchedule = (scheduleData) => {
    const filterGroupedSchedules = scheduleData.reduce((acc, item) => {
      const course = item.course;
      const year = item.stud_year;
      const section = item.section;

      if (!acc[course]) {
        acc[course] = {};
      }
      if (!acc[course][year]) {
        acc[course][year] = {};
      }
      if (!acc[course][year][section]) {
        acc[course][year][section] = [];
      }
      acc[course][year][section].push(item);
      return acc;
    }, {});

    setGroupedSchedules(filterGroupedSchedules);
  };

  useEffect(() => {
    groupTheSchedule(filteredSchedule);
  }, [filteredSchedule]);

  // Handle delete action
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

  // Handle course change
  const handleCourseChange = (eventKey) => {
    setSelectedCourse(eventKey);

    if (eventKey === "All") {
      setFilteredSchedule(schedule); // Reset to full schedule if "All" is selected
    } else {
      const filterCourse = schedule.filter((item) => item.course === eventKey);
      setFilteredSchedule(filterCourse); // Filter by selected course
    }
  };

  // Handle year change
  const handleYearChange = (eventKey) => {
    setSelectedYear(eventKey);
  };

  // Handle section change
  const handleSectionChange = (eventKey) => {
    setSelectedSection(eventKey);
  };

  // Filter schedules based on selected year and section
  const filteredSchedules = Object.keys(groupedSchedules)
    .filter((course) => selectedCourse === "All" || course === selectedCourse)
    .reduce((acc, course) => {
      acc[course] = Object.keys(groupedSchedules[course])
        .filter(
          (year) => selectedYear === "Select Year" || year === selectedYear
        )
        .reduce((yearAcc, year) => {
          yearAcc[year] = Object.keys(groupedSchedules[course][year])
            .filter(
              (section) =>
                selectedSection === "Select Section" ||
                section === selectedSection
            )
            .reduce((secAcc, section) => {
              secAcc[section] = groupedSchedules[course][year][section];
              return secAcc;
            }, {});
          return yearAcc;
        }, {});
      return acc;
    }, {});

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-4">View Schedule</h1>
      <h4 className="text-center mb-4">{selectedCourse}</h4>
      <Row>
        <Col md={10} className="mx-auto">
          <Row className="mb-4">
            <Col>
              <Dropdown onSelect={handleCourseChange}>
                <Dropdown.Toggle
                  id="dropdown-button-year"
                  variant="secondary"
                  className="w-100"
                >
                  {selectedCourse || "All"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="All">All</Dropdown.Item>{" "}
                  {course.map((item) => (
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

          {/* Render filtered schedules */}
          {Object.keys(filteredSchedules).map((course) => (
            <div key={course}>
              <h4 className="text-center mb-4">{course}</h4>
              {Object.keys(filteredSchedules[course]).map((year) => (
                <div key={year}>
                  {Object.keys(filteredSchedules[course][year]).map(
                    (section) => (
                      <Card key={section} className="mb-4 shadow-sm card-table">
                        <Card.Header className="bg-primary text-white text-center bg-secondary">
                          <h5 className="mb-0">
                            Year: {year} Section: {section}
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <Table
                            striped
                            bordered
                            hover
                            className="table-schedule"
                          >
                            <thead>
                              <tr>
                                <th>Course</th>
                                <th>Subject</th>
                                <th>Schedule</th>
                                <th>Instructor</th>
                                <th>Room</th>
                                <th>Day</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredSchedules[course][year][section].map(
                                (item) => (
                                  <tr key={item.id}>
                                    <td>{item.course}</td>
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
                                )
                              )}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    )
                  )}
                </div>
              ))}
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ViewSchedule;
