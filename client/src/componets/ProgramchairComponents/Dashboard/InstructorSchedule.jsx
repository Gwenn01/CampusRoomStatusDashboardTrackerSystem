import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import "../../../styles/dashboard.css";

const InstructorSchedule = () => {
  // user login data
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));

  // state variables
  const [courseData, setCourseData] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [groupInstructor, setGroupInstructor] = useState({});
  const [instructor, setInstructor] = useState([]);
  const [selectedInstructor, setSelectedInstructor] =
    useState("Select Instructor");

  // get the data from database
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
        console.log("Error fetching course data:", error);
      });
  }, []);

  // fetching schedule data from database
  useEffect(() => {
    fetch("http://localhost:5000/api/view-schedule")
      .then((response) => response.json())
      .then((data) =>
        setSchedule(data.filter((item) => item.course_id == user.course_id))
      )
      .catch((error) => console.error(error));
  }, []);

  // fetching instructor data from database (fixed: add dependency array)
  useEffect(() => {
    fetch("http://localhost:5000/api/instructor")
      .then((response) => response.json())
      .then((data) => setInstructor(data))
      .catch((error) => console.error(error));
  }, []);
  // function to sort the time in schedule
  const compareTime = (a, b) => {
    const parseTimeRange = (timeStr) => {
      // Split start and end times (e.g., "12:30 PM - 2:00 PM")
      const [startTime] = timeStr.split(" - ");
      // Function to convert time string into 24-hour format for comparison
      const parseTime = (time) => {
        let [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":");
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        if (modifier === "PM" && hours !== 12) {
          hours += 12;
        } else if (modifier === "AM" && hours === 12) {
          hours = 0;
        }
        return hours * 60 + minutes; // Convert to total minutes for easier comparison
      };
      return parseTime(startTime); // Compare based on the start time of the range
    };
    return parseTimeRange(a) - parseTimeRange(b);
  };
  // Group schedules by instructor and sort by time
  const groupTheSchedules = () => {
    const groupedSchedules = schedule
      .sort((a, b) => compareTime(a.time_sched, b.time_sched)) // Sort schedules by time first
      .reduce((acc, item) => {
        const instructor = item.instructor;
        if (!acc[instructor]) {
          acc[instructor] = [];
        }
        acc[instructor].push(item);
        return acc;
      }, {});
    setGroupInstructor(groupedSchedules);
  };

  // Group schedules whenever schedule changes
  useEffect(() => {
    groupTheSchedules();
  }, [schedule]);

  // handle the instructor change
  const handleInstructorChange = (eventKey) => {
    setSelectedInstructor(eventKey);
  };

  // filter schedules based on the selected instructor
  const filteredSchedulesForInstructor =
    selectedInstructor === "Select Instructor"
      ? groupInstructor // show all if none is selected
      : { [selectedInstructor]: groupInstructor[selectedInstructor] }; // filter based on selection

  return (
    <Container
      fluid
      className="p-4 w-100"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-1">Instructor Schedule</h1>
      <h1 className="text-center mb-4">
        {courseData.length > 0 ? `${courseData[0].course_name}` : "Loading..."}
      </h1>
      <Row className="w-100">
        <Col md={10} className="mx-auto">
          <Row className="mb-4">
            <Col>
              <Dropdown onSelect={handleInstructorChange}>
                <Dropdown.Toggle
                  id="dropdown-button-year"
                  variant="secondary"
                  className="w-100"
                >
                  {selectedInstructor || "Select Instructor"}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {instructor.map((instructor) => (
                    <Dropdown.Item
                      key={instructor.instructor_id}
                      eventKey={instructor.instructor_name}
                    >
                      {instructor.instructor_name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          {Object.keys(filteredSchedulesForInstructor).map((instructor) => (
            <Card key={instructor} className="mb-4 shadow-sm card-table">
              <Card.Header className="bg-primary text-white text-center bg-secondary">
                <h5 className="mb-0">{instructor}</h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover className="table-schedule">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Schedule</th>
                      <th>Room</th>
                      <th>Day</th>
                      <th>Year</th>
                      <th>Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchedulesForInstructor[instructor] &&
                      filteredSchedulesForInstructor[instructor].map((item) => (
                        <tr key={item.id}>
                          <td>{item.subject_description}</td>
                          <td>{item.time_sched}</td>
                          <td>{item.room}</td>
                          <td>{item.day_sched}</td>
                          <td>{item.srud_year}</td>
                          <td>{item.section}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default InstructorSchedule;
