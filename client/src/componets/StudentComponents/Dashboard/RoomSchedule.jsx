import React, { useEffect, useState } from "react";
import { Table, Container, Row, Col, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "../../../styles/dashboard.css";

const RoomSchedule = () => {
  // User data
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));

  // Schedule data
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

  // Helper function to convert 12-hour time format to 24-hour format
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

  // Compare two time schedules
  const compareTime = (timeA, timeB) => {
    const a = convertTo24HourFormat(timeA);
    const b = convertTo24HourFormat(timeB);

    if (a.hours !== b.hours) {
      return a.hours - b.hours; // Sort by hour
    }
    return a.minutes - b.minutes; // Sort by minute
  };

  // Sort rooms and their schedules
  const sortedRooms = Object.keys(groupedSchedules).sort((a, b) => {
    const isRoomA = a.toLowerCase().startsWith("room");
    const isRoomB = b.toLowerCase().startsWith("room");

    if (isRoomA && !isRoomB) return -1; // a is room, b is lab
    if (!isRoomA && isRoomB) return 1; // a is lab, b is room

    // Sort by room number
    const roomNumberA = parseInt(a.match(/\d+/)) || 0; // Extract number and convert to int
    const roomNumberB = parseInt(b.match(/\d+/)) || 0; // Extract number and convert to int
    if (roomNumberA !== roomNumberB) return roomNumberA - roomNumberB; // Sort by extracted room number

    // If both are rooms or labs and the same number, sort alphabetically
    return a.localeCompare(b);
  });

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
          {sortedRooms.map((room) => (
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
                    {groupedSchedules[room]
                      .sort((a, b) => compareTime(a.time_sched, b.time_sched)) // Sort time
                      .map((item) => (
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
