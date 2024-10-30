import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, Container, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";

const Reports = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));

  const [reportsData, setReportsData] = useState({});

  useEffect(() => {
    try {
      const fetchReportData = async () => {
        const response = await fetch("http://localhost:5000/api/report-data");
        const data = await response.json();
        const groupedData = groupByInstructor(data);

        setReportsData(groupedData);
      };
      fetchReportData();
    } catch (error) {
      toast.error("Failed to fetch report data");
    }
  }, []);

  const groupByInstructor = (schedule) => {
    return schedule.reduce((acc, curr) => {
      const instructor = curr.instructor_name;
      if (!acc[instructor]) {
        acc[instructor] = [];
      }
      acc[instructor].push(curr);
      return acc;
    }, {});
  };

  return (
    <Container
      fluid
      className="p-4 w-100"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Row>
        <Col md={10} className="mx-auto">
          {Object.keys(reportsData).length > 0 ? (
            Object.keys(reportsData).map((instructor, idx) => (
              <Card
                key={idx}
                className="shadow-sm my-3"
                style={{ width: "90%" }}
              >
                <Card.Header className="bg-secondary text-white text-center">
                  <h5 className="mb-0" style={{ fontSize: "1.2rem" }}>
                    Reports for {instructor}
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
                      {reportsData[instructor].map((report, index) => (
                        <tr key={index}>
                          <td>{report.room_name}</td>
                          <td>{report.instructor_name}</td>
                          <td>{report.time_in}</td>
                          <td>{report.time_out}</td>
                          <td>{report.time_count}</td>
                          <td>{report.date_reports}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Card className="shadow-sm my-3" style={{ width: "90%" }}>
              <Card.Body className="text-center">
                No reports available.
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
