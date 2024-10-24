import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, Container, Row, Col, Card } from "react-bootstrap";
import "../../../styles/dashboard.css";

const ViewSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));

  const fetchData = () => {
    fetch(`http://localhost:5000/api/view-schedule/${user.instructor_name}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSchedule(data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error.message);
        setLoading(false); // Set loading to false on error
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const groupedSchedules = schedule.reduce((acc, item) => {
    const course = item.course;
    const year = item.stud_year;
    const section = item.section;

    if (!acc[course]) {
      acc[course] = {};
    }
    if (!acc[course][year]) {
      acc[course][year] = {};
    }
    if (!acc[course][year][section]) {
      acc[course][year][section] = [];
    }

    acc[course][year][section].push(item);
    return acc;
  }, {});

  if (loading) {
    return <div>Loading...</div>; // Display loading message while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if there's an error
  }

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-1">View Schedule</h1>
      <Row>
        <Col md={10} className="mx-auto">
          {Object.keys(groupedSchedules).map((course) => (
            <div key={course}>
              <h4 className="text-center mb-4">Course: {course}</h4>
              {Object.keys(groupedSchedules[course]).map((year) => (
                <div key={year}>
                  {Object.keys(groupedSchedules[course][year]).map(
                    (section) => (
                      <Card key={section} className="mb-4 shadow-sm card-table">
                        <Card.Header className="bg-primary text-white text-center bg-secondary">
                          <h5 className="mb-0">
                            Year: {year} Section: {section}
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <Table
                            striped
                            bordered
                            hover
                            className="table-schedule"
                          >
                            <thead>
                              <tr>
                                <th>Subject</th>
                                <th>Schedule</th>
                                <th>Room</th>
                                <th>Day</th>
                              </tr>
                            </thead>
                            <tbody>
                              {groupedSchedules[course][year][section]
                                .sort((a, b) =>
                                  compareTime(a.time_sched, b.time_sched)
                                )
                                .map((item) => (
                                  <tr key={item.id}>
                                    <td>{item.subject_description}</td>
                                    <td>{item.time_sched}</td>
                                    <td>{item.room}</td>
                                    <td>{item.day_sched}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    )
                  )}
                </div>
              ))}
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ViewSchedule;
