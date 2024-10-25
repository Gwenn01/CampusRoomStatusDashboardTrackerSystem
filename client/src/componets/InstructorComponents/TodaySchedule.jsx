import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Table } from "react-bootstrap";
import { toast } from "react-toastify";

// Helper function to format the day of the week
const formatDay = (date) => {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
};

// Helper function to format the full date
const formatDate = (date) => {
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const TodaySchedule = () => {
  // user data
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));
  // state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [dayToday, setDayToday] = useState(formatDay(new Date()));
  // fetch the data from databse
  useEffect(() => {
    if (user?.instructor_id && dayToday) {
      fetchSchedule();
    }
  }, [user?.instructor_id, dayToday]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  // check if the day has changed
  useEffect(() => {
    const checkDayChange = setInterval(() => {
      const newDay = formatDay(new Date());
      if (newDay !== dayToday) {
        setDayToday(newDay);
      }
    }, 60000);
    return () => clearInterval(checkDayChange);
  }, [dayToday]);

  // fetch the schedule from the database
  const fetchSchedule = () => {
    fetch(
      `http://localhost:5000/api/view-schedule/${user.instructor_id}/${dayToday}`
    )
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch(() => toast.error("Error fetching schedule"));
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
    <Container
      fluid
      className="p-4 position-relative"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <div
        className="position-absolute"
        style={{
          top: "10px",
          right: "20px",
          fontWeight: "bold",
          color: "#34495e",
        }}
      >
        {formatDate(currentTime)}
      </div>

      <h1 className="text-center mb-1">Today's Schedule</h1>
      <h2 className="text-center mb-3">{dayToday}</h2>

      <Row>
        <Col>
          <Table
            striped
            bordered
            hover
            style={{
              fontSize: "0.7rem",
              backgroundColor: "#ecf0f1",
              color: "#2c3e50",
            }}
          >
            <thead>
              <tr>
                <th>Course</th>
                <th>Subject</th>
                <th>Year & Section</th>
                <th>Time</th>
                <th>Room</th>
                <th>Possible Room Available</th>
              </tr>
            </thead>
            <tbody>
              {schedule
                .sort((a, b) => compareTime(a.time_sched, b.time_sched))
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.course}</td>
                    <td>{item.subject_description}</td>
                    <td>
                      {item.stud_year} {item.section}
                    </td>
                    <td>{item.time_sched}</td>
                    <td>{item.room}</td>
                    <td>{item.possible_room_available || "N/A"}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default TodaySchedule;
