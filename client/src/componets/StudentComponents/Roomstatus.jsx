import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";
import "../../styles/roomstatus.css";
import vacantIcon from "../../assets/vacant.png";
import occupiedIcon from "../../assets/occupied.png";

const RoomStatus = () => {
  // States
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedule, setSchedule] = useState([]); // Full schedule data
  const [filteredSchedule, setFilteredSchedule] = useState([]); // Filtered data
  const [rooms, setRooms] = useState([]);

  // Modal states
  const [show, setShow] = useState(false);
  const [selectedRoomSchedule, setSelectedRoomSchedule] = useState([]); // Selected room's schedule
  const [selectedDay, setSelectedDay] = useState(""); // Selected day's schedule
  const [selectedRoomName, setSelectedRoomName] = useState(""); // Selected room name

  const handleClose = () => setShow(false);

  // Fetch room data
  const fetchRooms = () => {
    fetch("http://localhost:5000/api/get-rooms")
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Fetch schedule data
  useEffect(() => {
    fetch("http://localhost:5000/api/view-schedule")
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch((error) => console.error(error));
  }, []);

  // Function to get the current day as a string
  const formatDay = (date) => {
    const options = {
      weekday: "long",
      timeZone: "Asia/Manila",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  // Filter the schedule for the current day
  useEffect(() => {
    if (schedule.length > 0) {
      const today = new Date();
      const dayString = formatDay(today); // Get the current day
      setSelectedDay(dayString); // Set the selected day to current day

      const filterSchedule = schedule.filter(
        (item) => item.day_sched === dayString
      );
      setFilteredSchedule(filterSchedule); // Update only the filtered schedule
    }
  }, [schedule]); // Runs only when schedule changes

  // Handle current time and date
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer); // Cleanup the timer
  }, []);

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Manila",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const formatTime = (date) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "Asia/Manila",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  // Handle "View Details" click
  const handleShowDetails = (roomName) => {
    const roomSchedule = filteredSchedule.filter(
      (item) => item.room === roomName
    );

    setSelectedRoomSchedule(roomSchedule); // Store the schedule for the selected room
    setSelectedRoomName(roomName); // Store the room name
    setShow(true);
  };

  return (
    <Container fluid className="room-status-container">
      <h1>CCIT Building</h1>
      <Row>
        <Col>
          <p>Date today: {formatDate(currentTime)}</p>
        </Col>
        <Col>
          <p>Current Time: {formatTime(currentTime)}</p>
        </Col>
      </Row>

      <Row>
        {rooms.map((room, index) => (
          <Col key={index} sm={6} md={4} lg={3} className="mb-4">
            <Card
              className="room-card"
              style={{
                backgroundColor:
                  room.roomStatus === "vacant" ? "lightgreen" : "lightcoral",
              }}
            >
              <Card.Body>
                <Card.Title className="room-title">{room.roomName}</Card.Title>
                <span>{room.roomStatus}</span>
                <Card.Text className="room-body">
                  <img
                    src={
                      room.roomStatus === "vacant" ? vacantIcon : occupiedIcon
                    }
                    alt="room status"
                  />
                  {room.roomStatus === "occupied" ? (
                    <div
                      className="room-info d-flex justify-content-center align-items-center flex-column"
                      style={{ fontSize: "0.7rem" }}
                    >
                      <span>{room.instructorName}</span>
                      <span>Time in: {room.timeIn}</span>
                    </div>
                  ) : (
                    ""
                  )}
                </Card.Text>
                <Button
                  variant="primary"
                  className="view-btn"
                  onClick={() => handleShowDetails(room.roomName)}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for showing room details */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Schedule for {selectedRoomName} <br /> {selectedDay}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoomSchedule.length > 0 ? (
            <Table striped bordered hover className="w-100">
              <thead>
                <tr>
                  <th>Time & Instructor</th>
                  <th>Course</th>
                  <th>Year & Section</th>
                </tr>
              </thead>
              <tbody>
                {selectedRoomSchedule.map((scheduleItem, index) => (
                  <tr key={index}>
                    <td>
                      {scheduleItem.time_sched} {scheduleItem.instructor}
                    </td>
                    <td>{scheduleItem.subject_description}</td>
                    <td>
                      {scheduleItem.stud_year} {scheduleItem.section}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No schedule available for this room.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RoomStatus;
