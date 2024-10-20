import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, Container, Row, Col, Card } from "react-bootstrap";
import "../../../styles/dashboard.css";

const ViewSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  // Identify the user
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));

  // Function to fetch schedules from the API
  const fetchData = () => {
    fetch(
      `http://localhost:5000/api/view-exam-schedule/${user.instructor_name}`
    )
      .then((response) => response.json())
      .then((data) => setSchedule(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
  }, []);

  // Group schedules by course, year, and section
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

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-4">View Exam Schedule</h1>
      <Row>
        <Col md={10} className="mx-auto">
          {Object.keys(groupedSchedules).map((course) => (
            <div key={course}>
              <h4 className="text-center text-primary mb-4">
                Course: {course}
              </h4>
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
                              {groupedSchedules[course][year][section].map(
                                (item) => (
                                  <tr key={item.id}>
                                    <td>{item.subject_description}</td>
                                    <td>{item.time_sched}</td>
                                    <td>{item.room}</td>
                                    <td>{item.day_sched}</td>
                                  </tr>
                                )
                              )}
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
