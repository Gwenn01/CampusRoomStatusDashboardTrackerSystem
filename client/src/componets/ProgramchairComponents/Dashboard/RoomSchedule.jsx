import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Table, Container, Row, Col, Card, Button } from "react-bootstrap";
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

  // Fetch course data
  useEffect(() => {
    fetch(`http://localhost:5000/api/course/${user.course_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setCourseData(data))
      .catch((error) => console.log("Error fetching course data:", error));
  }, []);

  // Fetch schedule data
  useEffect(() => {
    fetch("http://localhost:5000/api/view-schedule")
      .then((response) => response.json())
      .then((data) =>
        setSchedule(data.filter((item) => item.course_id == user.course_id))
      )
      .catch((error) => console.error(error));
  }, []);

  // Fetch room data
  useEffect(() => {
    fetch("http://localhost:5000/api/get-rooms")
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error(error));
  }, []);

  // function to sort the time in the room schedule
  const compareTime = (a, b) => {
    const parseTime = (time) => {
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes; // Convert to total minutes for comparison
    };
    const [startTimeA] = a.time_sched.split(" - ");
    const [startTimeB] = b.time_sched.split(" - ");
    return parseTime(startTimeA) - parseTime(startTimeB);
  };

  // Group and sort schedules by room and then by time
  const groupTheRoom = () => {
    const groupedSchedules = schedule.reduce((acc, item) => {
      const room = item.room;
      if (!acc[room]) {
        acc[room] = [];
      }
      acc[room].push(item);
      return acc;
    }, {});
    // Sort the schedules within each room by time
    Object.keys(groupedSchedules).forEach((room) => {
      groupedSchedules[room] = groupedSchedules[room].sort(compareTime);
    });
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

  // Custom sort function to handle numeric room sorting and prioritize "rooms" over "labs"
  const customRoomSort = (a, b) => {
    const isRoomA = a.toLowerCase().includes("room");
    const isRoomB = b.toLowerCase().includes("room");

    // Prioritize "room" over "lab"
    if (isRoomA && !isRoomB) return -1;
    if (!isRoomA && isRoomB) return 1;

    // Extract numeric values from room names for comparison
    const extractNumber = (name) => {
      const match = name.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };

    const numA = extractNumber(a);
    const numB = extractNumber(b);

    // Compare numerically if both are rooms or both are labs
    return numA - numB;
  };

  // Sort room names based on the custom sort
  const sortedRooms = Object.keys(filteredSchedulesForRoom).sort(
    customRoomSort
  );
  // handle the delete button
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      fetch(`http://localhost:5000/api/delete-schedule/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          fetchData();
          toast.success("Schedule deleted successfully.");
        })
        .catch((error) => console.error(error));
    }
  };

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
                <Dropdown.Menu
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {rooms.map((room) => (
                    <Dropdown.Item key={room.id} eventKey={room.roomName}>
                      {room.roomName}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
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
                      <th>Year</th>
                      <th>Section</th>
                      <th>Time</th>
                      <th>Day</th>
                      <th>Action</th>
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
                        <td className="text-center">
                          <Link to={`edit-schedule/${item.id}`}>
                            <Button
                              variant="warning"
                              style={{
                                fontSize: "0.5rem",
                                width: "3.5rem",
                                marginRight: "5px",
                              }}
                            >
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(item.id)}
                            style={{
                              fontSize: "0.5rem",
                              width: "3.5rem",
                            }}
                          >
                            Delete
                          </Button>
                        </td>
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
