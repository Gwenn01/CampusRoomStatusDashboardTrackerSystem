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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [show, setShow] = useState(false);
  const [selectedRoomSchedule, setSelectedRoomSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedRoomName, setSelectedRoomName] = useState("");

  // Store time counts in an object where keys are room IDs
  const [timeCounts, setTimeCounts] = useState(0);

  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [dateReports, setDateReports] = useState("");

  const handleClose = () => setShow(false);

  const fetchRooms = () => {
    fetch("http://localhost:5000/api/get-rooms")
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/view-schedule")
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch((error) => console.error(error));
  }, []);

  const formatDay = (date) => {
    const options = {
      weekday: "long",
      timeZone: "Asia/Manila",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  useEffect(() => {
    if (schedule.length > 0) {
      const today = new Date();
      const dayString = formatDay(today);
      setSelectedDay(dayString);

      const filterSchedule = schedule.filter(
        (item) => item.day_sched === dayString
      );
      setFilteredSchedule(filterSchedule);
    }
  }, [schedule]);

  const handleStatusButton = (room_id, status, action) => {
    // Update time counts based on the room clicked
    const updatedTimeCounts = { ...timeCounts };

    if (action === "in") {
      const timeInValue = new Date().toLocaleTimeString();
      const dateValue = new Date().toLocaleDateString();

      setTimeIn(timeInValue);
      setDateReports(dateValue);
    }

    if (action === "out") {
      const timeOutValue = new Date().toLocaleTimeString();
      setTimeOut(timeOutValue);
    }

    fetch(`http://localhost:5000/api/update-room-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room_id, status }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update room status");
        }
        return response.json();
      })
      .then(() => {
        toast.success("Room status updated successfully");
        fetchRooms();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update room status");
      });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
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

  const handleShowDetails = (roomName) => {
    const roomSchedule = filteredSchedule.filter(
      (item) => item.room === roomName
    );

    setSelectedRoomSchedule(roomSchedule);
    setSelectedRoomName(roomName);
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
                  <span>
                    {timeCounts[room.id] === undefined
                      ? ""
                      : `${timeCounts[room.id]}s`}
                  </span>
                </Card.Text>
                <div className="button-group">
                  <Button
                    variant="success"
                    className="action-btn"
                    onClick={() =>
                      handleStatusButton(room.id, "occupied", "in")
                    }
                  >
                    In
                  </Button>
                  <Button
                    variant="danger"
                    className="action-btn"
                    onClick={() => handleStatusButton(room.id, "vacant", "out")}
                  >
                    Out
                  </Button>
                </div>
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
