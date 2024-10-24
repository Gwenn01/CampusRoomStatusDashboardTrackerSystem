import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, Container, Row, Col, Card } from "react-bootstrap";
import "../../../styles/dashboard.css";

const InstructorSchedule = () => {
  const [schedule, setSchedule] = useState([]);

  // Fetch schedule data
  useEffect(() => {
    fetch("http://localhost:5000/api/view-schedule")
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch((error) => console.error(error));
  }, []);

  // Retrieve user data (logged-in instructor)
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));

  // Filter schedules for the specific instructor
  const instructorSchedule = schedule.filter(
    (item) => item.instructor_id === user.instructor_id
  );
  // functions to sort the schedule by date and time
  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
  };
  const compareTime = (timeA, timeB) => {
    const a = convertTo24HourFormat(timeA);
    const b = convertTo24HourFormat(timeB);

    if (a.hours !== b.hours) {
      return a.hours - b.hours;
    } else {
      return a.minutes - b.minutes;
    }
  };

  return (
    <Container
      fluid
      className="p-4 w-100"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-1">Instructor Schedule</h1>
      <p className="text-center mb-4">{user.instructor_name}</p>
      <Row className="w-100">
        <Col md={10} className="mx-auto">
          {instructorSchedule.length > 0 ? (
            <Card className="mb-4 shadow-sm card-table">
              <Card.Header className="bg-primary text-white text-center bg-secondary">
                <h5 className="mb-0">{user.name}</h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover className="table-schedule">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Subject</th>
                      <th>Year & Section</th>
                      <th>Schedule</th>
                      <th>Room</th>
                      <th>Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructorSchedule
                      .sort((a, b) => compareTime(a.time_sched, b.time_sched))
                      .map((item) => (
                        <tr key={item.id}>
                          <td>{item.course}</td>
                          <td>{item.subject_description}</td>
                          <td>{`${item.stud_year} Section:${item.section}`}</td>
                          <td>{item.time_sched}</td>
                          <td>{item.room}</td>
                          <td>{item.day_sched}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ) : (
            <p className="text-center">
              No schedule available for this instructor.
            </p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default InstructorSchedule;
