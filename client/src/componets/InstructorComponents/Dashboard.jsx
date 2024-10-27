import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Link, Route, Routes } from "react-router-dom";

import InstructorSchedule from "./Dashboard/InstructorSchedule";
import ViewSchedule from "./Dashboard/ViewSchedule";
import RoomSchedule from "./Dashboard/RoomSchedule";
import ExamSchedule from "./Dashboard/ExamSchedule";
import Reports from "./Dashboard/Reports";
import "../../styles/dashboard.css";

const Dashboard = () => {
  return (
    <>
      <Container
        fluid
        className="p-4 accordion"
        style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
      >
        <Row>
          <Col>
            <ButtonGroup size="lg" className="mb-2 w-100">
              <Link to="instructor-schedule" className="w-100">
                <Button
                  variant="secondary"
                  className="btn-dashboard w-100 custom-btn"
                >
                  Instructor Schedule
                </Button>
              </Link>
              <Link to="view-schedule" className="w-100">
                <Button
                  variant="secondary"
                  className="btn-dashboard w-100 custom-btn"
                >
                  View Schedule
                </Button>
              </Link>

              <Link to="room-schedule" className="w-100">
                <Button
                  variant="secondary"
                  className="btn-dashboard w-100 custom-btn"
                >
                  Room Schedule
                </Button>
              </Link>
              <Link to="view-exam-schedule" className="w-100">
                <Button
                  variant="secondary"
                  className="btn-dashboard w-100 custom-btn"
                >
                  Exam Schedule
                </Button>
              </Link>
              <Link to="reports" className="w-100">
                <Button
                  variant="secondary"
                  className="btn-dashboard w-100 custom-btn"
                >
                  Reports
                </Button>
              </Link>
            </ButtonGroup>
          </Col>
        </Row>
        <Row className="w-100">
          <Routes>
            <Route index element={<InstructorSchedule />} />
            <Route
              path="instructor-schedule"
              element={<InstructorSchedule />}
            />
            <Route path="view-schedule" element={<ViewSchedule />} />
            <Route path="room-schedule" element={<RoomSchedule />} />
            <Route path="view-exam-schedule" element={<ExamSchedule />} />
            <Route path="reports" element={<Reports />} />
          </Routes>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
