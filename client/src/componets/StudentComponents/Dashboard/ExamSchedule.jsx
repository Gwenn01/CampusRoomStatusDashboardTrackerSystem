import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Table, Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../../styles/dashboard.css";
import { toast } from "react-toastify";

const ViewExamSchedule = () => {
  // user data
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));
  // shcedule data
  const [examSchedule, setExamSchedule] = useState([]);

  // Function to fetch schedules from the API
  const fetchData = () => {
    fetch(
      `http://localhost:5000/api/view-exam-schedule/${user.course}/${user.year}/${user.section}`
    )
      .then((response) => response.json())
      .then((data) => setExamSchedule(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    // Fetch data when component loads
    fetchData();
  }, []);
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
  // Group schedules by year and section
  const groupedSchedules = examSchedule.reduce((acc, item) => {
    const year = item.stud_year;
    const section = item.section;
    // If there's no year or section, create an empty array for it
    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][section]) {
      acc[year][section] = [];
    }
    acc[year][section].push(item);
    return acc;
  }, {});
  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-4">View Exam Schedule</h1>
      <h4 className="text-center mb-4">
        BS Information Technology Exam Schedule
      </h4>
      <Row>
        <Col md={10} className="mx-auto">
          {Object.keys(groupedSchedules).map((year) => (
            <div key={year}>
              {Object.keys(groupedSchedules[year]).map((section) => (
                <Card key={section} className="mb-4 shadow-sm card-table">
                  <Card.Header className="bg-primary text-white text-center bg-secondary">
                    <h5 className="mb-0">
                      {year} Year - Section {section}
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
                        </tr>
                      </thead>
                      <tbody>
                        {groupedSchedules[year][section]
                          .sort((a, b) =>
                            compareTime(a.time_sched, b.time_sched)
                          )
                          .map((item) => (
                            <tr key={item.id}>
                              <td>{item.subject_description}</td>
                              <td>{item.time_sched}</td>
                              <td>{item.instructor}</td>
                              <td>{item.room}</td>
                              <td>{item.day_sched}</td>
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

export default ViewExamSchedule;
