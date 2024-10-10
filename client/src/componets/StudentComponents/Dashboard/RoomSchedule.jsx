import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "../../../styles/dashboard.css";

const RoomSchedule = () => {
  // user data
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));
  // shcedule data
  const [schedule, setSchedule] = useState([]);

  // Function to fetch schedules from the API
  const fetchData = () => {
    fetch(
      `http://localhost:5000/api/view-schedule/${user.course}/${user.year}/${user.section}`
    )
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchData();
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
                      <th>Time</th>
                      <th>Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedSchedules[room].map((item) => (
                      <tr key={item.id}>
                        <td>{item.subject_description}</td>
                        <td>{item.instructor}</td>
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
