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
  const [posibleRoom, setPosibleRoom] = useState([]);
  // fetch the data from databse
  useEffect(() => {
    if (user?.instructor_id && dayToday) {
      const fetchSchedule = async () => {
        try {
          const instructorSchedResponse = await fetch(
            `http://localhost:5000/api/view-schedule/${user.instructor_id}/${dayToday}`
          );

          if (!instructorSchedResponse.ok) {
            throw new Error(
              `Error fetching instructor schedule: ${instructorSchedResponse.statusText}`
            );
          }

          const instructorSched = await instructorSchedResponse.json();

          const todaySchedResponse = await fetch(
            `http://localhost:5000/api/today-schedule/${dayToday}`
          );

          if (!todaySchedResponse.ok) {
            throw new Error(
              `Error fetching today's schedule: ${todaySchedResponse.statusText}`
            );
          }

          const todaySched = await todaySchedResponse.json();

          setSchedule(instructorSched);

          const possibleRooms = {}; // Initialize an empty object to hold possible rooms

          instructorSched.forEach((schedIns) => {
            const possible = new Set(); // Use a Set to avoid duplicates
            todaySched.forEach((sched) => {
              const endTime = convertTo24Hour(getEndTime(sched.time_sched));
              const instructorEndTime = convertTo24Hour(
                getEndTime(schedIns.time_sched)
              );
              const startTime = convertTo24Hour(getStartTime(sched.time_sched));
              const instructorStartTime = convertTo24Hour(
                getStartTime(schedIns.time_sched)
              );
              const checkIfPossible =
                parseInt(instructorEndTime.substring(0, 2)) <
                  parseInt(startTime.substring(0, 2)) ||
                parseInt(instructorStartTime.substring(0, 2)) >
                  parseInt(endTime.substring(0, 2));
              if (checkIfPossible) {
                possible.add(sched.room); // Add room to the Set
              } else {
                possible.delete(sched.room);
              }
            });
            // Create a key using both subject description and section
            const key = `${schedIns.subject_description}-${schedIns.section}-${schedIns.time_sched}`;
            possibleRooms[key] = Array.from(possible);
          });
          setPosibleRoom(possibleRooms); // Set the state with the possible rooms
        } catch (error) {
          console.error("Fetch error: ", error);
          toast.error(
            "Failed to load rooms and schedule data: " + error.message
          );
        }
      };
      fetchSchedule();
    }
  }, [user?.instructor_id, dayToday]);

  // function to filter the posible rooms
  function getStartTime(schedule) {
    // Split the string by the '-' character and trim spaces
    const parts = schedule.split("-");
    // Return the second part after trimming whitespace
    return parts[0].trim();
  }
  function getEndTime(schedule) {
    // Split the string by the '-' character and trim spaces
    const parts = schedule.split("-");
    // Return the second part after trimming whitespace
    return parts[1].trim();
  }
  // convert the time
  function convertTo24Hour(timeStr) {
    // Split the time string into parts
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    // Convert hours and minutes to numbers
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    // Adjust hours based on AM/PM
    if (modifier === "PM" && hours < 12) {
      hours += 12; // Convert PM hours to 24-hour format
    } else if (modifier === "AM" && hours === 12) {
      hours = 0; // Convert midnight (12 AM) to 0 hours
    }
    // Format hours and minutes to ensure two digits
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  }
  // for date in the uuper right corner
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
                .map((item, index) => {
                  // Create the key using subject_description and section
                  const key = `${item.subject_description}-${item.section}-${item.time_sched}`;
                  return (
                    <tr key={index}>
                      <td>{item.course}</td>
                      <td>{item.subject_description}</td>
                      <td>
                        {item.stud_year} {item.section}
                      </td>
                      <td>{item.time_sched}</td>
                      <td>{item.room}</td>
                      <td>
                        {posibleRoom[key] ? posibleRoom[key].join(", ") : "N/A"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default TodaySchedule;
