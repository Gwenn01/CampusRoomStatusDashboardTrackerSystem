import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Card } from "react-bootstrap";
import "../../../styles/dashboard.css";

const InstructorSchedule = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/view-schedule")
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch((error) => console.error(error));
  }, []);

  // Group schedules by instructor
  const groupedSchedules = schedule.reduce((acc, item) => {
    const instructor = item.instructor;

    // Initialize instructor if not already present
    if (!acc[instructor]) {
      acc[instructor] = [];
    }

    acc[instructor].push(item);
    return acc;
  }, {});

  return (
    <Container
      fluid
      className="p-4 w-100"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-4">Instructor Schedule</h1>
      <Row className="w-100">
        <Col md={10} className="mx-auto">
          {Object.keys(groupedSchedules).map((instructor) => (
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
                    </tr>
                  </thead>
                  <tbody>
                    {groupedSchedules[instructor].map((item) => (
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
        </Col>
      </Row>
    </Container>
  );
};

export default InstructorSchedule;
