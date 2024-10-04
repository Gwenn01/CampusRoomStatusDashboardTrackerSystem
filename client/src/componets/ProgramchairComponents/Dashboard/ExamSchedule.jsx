import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../../styles/dashboard.css";
import { toast } from "react-toastify";

const ViewExamSchedule = () => {
  const [examschedule, setExamschedule] = useState([]);

  // Function to fetch the exam schedules
  const fetchData = () => {
    fetch("http://localhost:5000/api/view-exam-schedule")
      .then((response) => response.json())
      .then((data) => setExamschedule(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    // Fetch data when component loads
    fetchData();
  }, []);

  // Group schedules by year and section
  const groupedSchedules = examschedule.reduce((acc, item) => {
    const year = item.stud_year;
    const section = item.section;
    // If there's no year or section, create an empty array for it
    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][section]) {
      acc[year][section] = [];
    }
    acc[year][section].push(item);
    return acc;
  }, {});

  // Handle delete action
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      fetch(`http://localhost:5000/api/delete-exam-schedule/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          // After deletion, refetch the updated schedule list
          fetchData();
          toast.success("Schedule deleted successfully.");
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-4">View Exam Schedule</h1>
      <h4 className="text-center mb-4">
        BS Information Technology Exam Schedule
      </h4>
      <Row>
        <Col md={10} className="mx-auto">
          {Object.keys(groupedSchedules).map((year) => (
            <div key={year}>
              {Object.keys(groupedSchedules[year]).map((section) => (
                <Card key={section} className="mb-4 shadow-sm card-table">
                  <Card.Header className="bg-primary text-white text-center bg-secondary">
                    <h5 className="mb-0">
                      {year} Year - Section {section}
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Table striped bordered hover className="table-schedule">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Schedule</th>
                          <th>Instructor</th>
                          <th>Room</th>
                          <th>Day</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedSchedules[year][section].map((item) => (
                          <tr key={item.id}>
                            <td>{item.subject_description}</td>
                            <td>{item.time_sched}</td>
                            <td>{item.instructor}</td>
                            <td>{item.room}</td>
                            <td>{item.day_sched}</td>
                            <td className="text-center">
                              <Link to={`edit-exam-schedule/${item.id}`}>
                                <Button
                                  variant="warning"
                                  style={{
                                    fontSize: "0.5rem",
                                    width: "4rem",
                                  }}
                                >
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="danger"
                                style={{
                                  fontSize: "0.5rem",
                                  width: "4rem",
                                }}
                                onClick={() => handleDelete(item.id)}
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
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ViewExamSchedule;
