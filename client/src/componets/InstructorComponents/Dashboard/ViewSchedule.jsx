import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../../styles/dashboard.css";
import { toast } from "react-toastify";

const ViewSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  // identify the user
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));
  // Function to fetch schedules from the API
  const fetchData = () => {
    fetch(`http://localhost:5000/api/view-schedule/${user.instructor_name}`)
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
  }, []);

  // Group schedules by year and section
  const groupedSchedules = schedule.reduce((acc, item) => {
    const year = item.stud_year;
    const section = item.section;
    // if there is no year or section, create an empty array for it
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
      <h1 className="text-center mb-4">View Schedule</h1>
      <h4 className="text-center mb-4">BS Information Technology Schedule</h4>
      <Row>
        <Col md={10} className="mx-auto">
          {Object.keys(groupedSchedules).map((year) => (
            <div key={year}>
              {Object.keys(groupedSchedules[year]).map((section) => (
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
                          <th>Room</th>
                          <th>Day</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedSchedules[year][section].map((item) => (
                          <tr key={item.id}>
                            <td>{item.subject_description}</td>
                            <td>{item.time_sched}</td>
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

export default ViewSchedule;
