import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, Container, Row, Col, Card } from "react-bootstrap";

const Reports = () => {
  // Get user data from location or localStorage
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));

  const [reportsData, setReportsData] = useState([]);

  useEffect(() => {
    // Fetch report data from the server
    fetch(`http://localhost:5000/api/report-data/${user.instructor_id}`)
      .then((response) => response.json())
      .then((data) => setReportsData(data))
      .catch((error) => console.error(error));
  }, []);

  // Filter the reports data by instructor ID
  const filteredReportsData = reportsData.filter(
    (report) => report.instructor_id === user.instructor_id
  );

  return (
    <Container
      fluid
      className="p-4 w-100"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Row>
        <Col md={10} className="mx-auto">
          <Card className="shadow-sm" style={{ width: "90%" }}>
            <Card.Header className="bg-secondary text-white text-center">
              <h5 className="mb-0" style={{ fontSize: "1.2rem" }}>
                Reports
              </h5>
            </Card.Header>
            <Card.Body>
              <Table
                striped
                bordered
                hover
                className="table-schedule"
                style={{ fontSize: "0.7rem" }}
              >
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Instructor Name</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Time Count</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReportsData.length > 0 ? (
                    filteredReportsData.map((report, index) => (
                      <tr key={index}>
                        <td>{report.room_name}</td>
                        <td>{report.instructor_name}</td>
                        <td>{report.time_in}</td>
                        <td>{report.time_out}</td>
                        <td>{report.time_count}</td>
                        <td>{report.date_reports}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No reports available for this instructor.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
