import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Card } from "react-bootstrap";
import "../../../styles/dashboard.css";

const RoomSchedule = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/view-schedule")
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch((error) => console.error(error));
  }, []);

  // Group schedules by room
  const groupedSchedules = schedule.reduce((acc, item) => {
    const room = item.room;
    if (!acc[room]) {
      acc[room] = [];
    }
    acc[room].push(item);
    return acc;
  }, {});

  return (
    <Container
      fluid
      className=""
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-4">View Schedule</h1>
      <h4 className="text-center mb-4">CCIT Room and Laboratory</h4>
      <Row>
        <Col md={10} className="mx-auto">
          {Object.keys(groupedSchedules).map((room) => (
            <Card key={room} className="mb-4 shadow-sm card-table">
              <Card.Header className="bg-primary text-white text-center bg-secondary">
                <h5 className="mb-0">Room: {room}</h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover className="table-schedule">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Instructor</th>
                      <th>Year</th>
                      <th>Section</th>
                      <th>Time</th>
                      <th>Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedSchedules[room].map((item) => (
                      <tr key={item.id}>
                        <td>{item.subject_description}</td>
                        <td>{item.instructor}</td>
                        <td>{item.stud_year}</td>
                        <td>{item.section}</td>
                        <td>{item.time_sched}</td>
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

export default RoomSchedule;
