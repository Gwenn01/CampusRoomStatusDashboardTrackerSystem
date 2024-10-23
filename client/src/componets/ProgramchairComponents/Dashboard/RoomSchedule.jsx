import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, Container, Row, Col, Card } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import "../../../styles/dashboard.css";

const RoomSchedule = () => {
  // user login data
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));
  // State variables
  const [courseData, setCourseData] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [groupRoom, setGroupRoom] = useState({});
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("Select Room");

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
  // Fetch schedule data from the database
  useEffect(() => {
    fetch("http://localhost:5000/api/view-schedule")
      .then((response) => response.json())
      .then((data) =>
        setSchedule(data.filter((item) => item.course_id == user.course_id))
      )
      .catch((error) => console.error(error));
  }, []);

  // Fetch room data from the database
  useEffect(() => {
    fetch("http://localhost:5000/api/get-rooms")
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error(error));
  }, []);

  // Group schedules by room
  const groupTheRoom = () => {
    const groupedSchedules = schedule.reduce((acc, item) => {
      const room = item.room;
      if (!acc[room]) {
        acc[room] = [];
      }
      acc[room].push(item);
      return acc;
    }, {});
    setGroupRoom(groupedSchedules);
  };

  // Group schedules whenever schedule data changes
  useEffect(() => {
    groupTheRoom();
  }, [schedule]);

  // Handle room change
  const handleRoomChange = (eventKey) => {
    setSelectedRoom(eventKey);
  };

  // Filter schedules based on selected room
  const filteredSchedulesForRoom =
    selectedRoom === "Select Room"
      ? groupRoom // show all if no room is selected
      : { [selectedRoom]: groupRoom[selectedRoom] }; // filter schedules for the selected room

  return (
    <Container fluid style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h1 className="text-center mb-1">Room Schedule</h1>
      <h1 className="text-center mb-1">
        {courseData.length > 0 ? `${courseData[0].course_name}` : "Loading..."}
      </h1>
      <h4 className="text-center mb-3">CCIT Room and Laboratory</h4>
      <Row>
        <Col md={10} className="mx-auto">
          <Row className="mb-4">
            <Col>
              <Dropdown onSelect={handleRoomChange}>
                <Dropdown.Toggle
                  id="dropdown-button-room"
                  variant="secondary"
                  className="w-100"
                >
                  {selectedRoom || "Select Room"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {rooms.map((room) => (
                    <Dropdown.Item key={room.id} eventKey={room.roomName}>
                      {room.roomName}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          {Object.keys(filteredSchedulesForRoom).map((room) => (
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
                    {filteredSchedulesForRoom[room]?.map((item) => (
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
