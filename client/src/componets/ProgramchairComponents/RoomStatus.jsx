import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  // user data
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));

  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedRoomSchedule, setSelectedRoomSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedRoomName, setSelectedRoomName] = useState("");

  const handleClose = () => setShow(false);

  // Get today's day only
  const getDayOnly = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get-rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  const fetchSchedule = async () => {
    const dayToday = getDayOnly(new Date());
    try {
      const response = await fetch(
        `http://localhost:5000/api/today-schedule/${dayToday}`
      );
      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchSchedule();
  }, []);

  const formatDay = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "Asia/Manila",
    }).format(date);
  };

  useEffect(() => {
    const today = new Date();
    const dayString = formatDay(today);
    setSelectedDay(dayString);
  }, [schedule]);

  // Handle the Out button functionality
  const handleStatusButtonOut = async (room_id, status, roomName, timeIn) => {
    const isRoomVacant = rooms.some((room) => {
      if (room.id === room_id && room.roomStatus === "vacant") {
        toast.error("You can only check out if the room is occupied.");
        return true;
      }
      return false;
    });

    if (isRoomVacant) return;

    const room_name = roomName;
    const instructor_name = user.programchair_name;
    const time_out = new Date().toLocaleTimeString();
    const instructor_id = user.programchair_id;
    const date_reports = new Date().toLocaleDateString();

    try {
      const reportResponse = await fetch(
        "http://localhost:5000/api/insert-report-data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room_name,
            instructor_name,
            time_in: timeIn,
            time_out,
            instructor_id,
            date_reports,
          }),
        }
      );
      if (!reportResponse.ok) throw new Error("Failed to insert report data");

      toast.success("Report data inserted successfully");

      const roomStatusResponse = await fetch(
        "http://localhost:5000/api/update-room-status",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room_id,
            status,
            instructorName: "",
            timeIn: "",
          }),
        }
      );
      if (!roomStatusResponse.ok)
        throw new Error("Failed to update room status");

      toast.success("Room status updated successfully");
      fetchRooms();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Manila",
    }).format(date);

  const formatTime = (date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "Asia/Manila",
    }).format(date);

  const handleShowDetails = (roomName) => {
    const roomSchedule = schedule.filter((item) => item.room === roomName);
    setSelectedRoomSchedule(roomSchedule);
    setSelectedRoomName(roomName);
    setShow(true);
  };

  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    else if (modifier === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const compareTime = (timeA, timeB) => {
    const a = convertTo24HourFormat(timeA);
    const b = convertTo24HourFormat(timeB);
    return a.hours !== b.hours ? a.hours - b.hours : a.minutes - b.minutes;
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
                  {room.roomStatus === "occupied" && (
                    <div
                      className="room-info d-flex justify-content-center align-items-center flex-column"
                      style={{ fontSize: "0.7rem" }}
                    >
                      <span>{room.instructorName}</span>
                      <span>Time in: {room.timeIn}</span>
                    </div>
                  )}
                </Card.Text>
                <Button
                  variant="danger"
                  className="view-btn mb-2"
                  onClick={() =>
                    handleStatusButtonOut(
                      room.id,
                      "vacant",
                      room.roomName,
                      room.timeIn
                    )
                  }
                >
                  Out
                </Button>
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
                {selectedRoomSchedule
                  .sort((a, b) => compareTime(a.time_sched, b.time_sched))
                  .map((scheduleItem, index) => (
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
      </Modal>
    </Container>
  );
};

export default RoomStatus;
