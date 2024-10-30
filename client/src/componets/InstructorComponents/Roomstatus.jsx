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

// helper function to get day only from date
const getDayOnly = (date) => {
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

const RoomStatus = () => {
  // user sata
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));
  // variables for roomstatus
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [scheduleToday, setScheduleToday] = useState([]);
  // variables for view schedule details of room
  const [show, setShow] = useState(false);
  const [selectedRoomSchedule, setSelectedRoomSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedRoomName, setSelectedRoomName] = useState("");

  const handleClose = () => setShow(false);

  // fetch the schedule in the database to show in view details schedule
  const fetchSchedule = () => {
    const dayTodayy = getDayOnly(new Date());
    fetch(`http://localhost:5000/api/today-schedule/${dayTodayy}`)
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    fetchSchedule();
  }, []);
  // fetch the schedule from the database base on the specific data
  useEffect(() => {
    fetchRoomsAndSchedule();
  }, [user.instructor_id]);
  const fetchRoomsAndSchedule = async () => {
    try {
      // date today
      const today = new Date();
      const dayToday = formatDay(today); // Get the current day
      // responese getting the data
      const roomsResponse = await fetch("http://localhost:5000/api/get-rooms");
      const roomsData = await roomsResponse.json();

      const scheduleResponse = await fetch(
        `http://localhost:5000/api/view-schedule/${user.instructor_id}/${dayToday}`
      );
      const scheduleData = await scheduleResponse.json();

      // Map and merge the data to update rooms with schedule info
      const updatedRooms = roomsData.map((room) => {
        const roomSchedule = scheduleData.find(
          (schedule) => schedule.room === room.roomName
        );

        return {
          ...room,
          instructorScheduleAt: roomSchedule
            ? `Schedule At: ${roomSchedule.time_sched}`
            : "No Schedule for this room ",
        };
      });

      setRooms(updatedRooms);
    } catch (error) {
      console.error("Error fetching rooms or schedule", error);
      toast.error("Failed to load rooms and schedule data");
    }
  };

  //function to get the date
  const formatDay = (date) => {
    const options = {
      weekday: "long",
      timeZone: "Asia/Manila",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  // filtered the schedule base on the day
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
  // handle the status button
  const handleStatusButtonIn = (room_id, status) => {
    // get the value if the instructor click in and out
    let instructorName = "";
    if (user.instructor_name) {
      instructorName = user.instructor_name;
    } else if (user.programchair_name) {
      instructorName = user.programchair_name;
    }

    let timeIn = new Date().toLocaleTimeString();
    // updating in the databse when room is occupied or not
    fetch(`http://localhost:5000/api/update-room-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room_id, status, instructorName, timeIn }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update room status");
        }
        return response.json();
      })
      .then(() => {
        fetchRoomsAndSchedule();
        toast.success("Room status updated successfully");
      })
      .catch((error) => {
        toast.error("Failed to update room status");
      });
  };
  // handle the out button
  const handleStatusButtonOut = (
    room_id,
    status,
    roomName,
    instructorName,
    timeIn
  ) => {
    const room_name = roomName;
    const instructor_name = instructorName;
    const time_in = timeIn;
    const time_out = new Date().toLocaleTimeString();
    const instructor_id = user.instructor_id;
    const date_reports = new Date().toLocaleDateString();

    // First, insert the report data into the database
    fetch(`http://localhost:5000/api/insert-report-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room_name,
        instructor_name,
        time_in,
        time_out,
        instructor_id,
        date_reports,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to insert report data");
        }
      })
      .then(() => {
        toast.success("Insert report data successfully");
      })
      .catch((error) => {
        toast.error("Failed to insert report data");
      });

    const updatedInstructorName = ""; // reset the value in room status after click the button out
    const updatedTimeIn = ""; // reset the value in room status after click the button out
    // update the room tabale if the room status is out
    fetch(`http://localhost:5000/api/update-room-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room_id,
        status,
        instructorName: updatedInstructorName,
        timeIn: updatedTimeIn,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update room status");
        }
        return response.json();
      })
      .then(() => {
        fetchRoomsAndSchedule();
        toast.success("Room status updated successfully");
      })
      .catch((error) => {
        toast.error("Failed to update room status", error);
      });
  };

  // Hnadle the timeee format date
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  // get the date and current time
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
  // get the day today
  const handleShowDetails = (roomName) => {
    const roomSchedule = filteredSchedule.filter(
      (item) => item.room === roomName
    );
    // set the values
    setSelectedRoomSchedule(roomSchedule);
    setSelectedRoomName(roomName);
    setShow(true);
  };
  // sort the schedule by time
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
                <span style={{ fontSize: "0.7rem" }}>
                  {room.instructorScheduleAt}
                </span>
                <br />
                <span>{room.roomStatus}</span>
                <Card.Text className="room-body ">
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
                <div className="button-group">
                  <Button
                    variant="success"
                    className="action-btn"
                    onClick={() => handleStatusButtonIn(room.id, "occupied")}
                  >
                    In
                  </Button>
                  <Button
                    variant="danger"
                    className="action-btn"
                    onClick={() =>
                      handleStatusButtonOut(
                        room.id,
                        "vacant",
                        room.roomName,
                        room.instructorName,
                        room.timeIn
                      )
                    }
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
