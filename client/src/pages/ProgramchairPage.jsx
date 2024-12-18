import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "../styles/programchair.css";
import { useLocation, Link, Route, Routes } from "react-router-dom";
import Header from "../shared/partition/Header";
import CreateSchedule from "../componets/ProgramchairComponents/CreateSched";
import CreateExamSchedule from "../componets/ProgramchairComponents/CreateExamSchedule";
import ManageCurriculum from "../componets/ProgramchairComponents/ManageCurriculum";
import CreateAccount from "../componets/ProgramchairComponents/CreateAccount";
import Dashboard from "../componets/ProgramchairComponents/Dashboard";
import RoomStatus from "../componets/ProgramchairComponents/RoomStatus";
// icons
import createScheduleIcon from "../assets/createschedule.png";
import createExamScheduleIcon from "../assets/createexam.png";
import manageCurriculum from "../assets/curriculum.png";
import createAccountIcon from "../assets/create-account.png";
import dashboard from "../assets/dashboard.png";
import roomStatus from "../assets/roomstatus.png";
import "../styles/responsive/userpage.css";

const ProgramChairPage = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));
  // side bar
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
      <Header />
      <button
        className="toggle-sidebar"
        onClick={toggleSidebar}
        style={{
          display: "fixed",
          top: "10%",
          left: "0",
          fontSize: "1rem",
          padding: "0 0.5rem 0 0.5rem",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        ☰
      </button>
      <div className="container-pg">
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="container-sidebarbtns">
            <Link to="create-schedule">
              <Button variant="secondary" className="btn-sidebar">
                <img src={createScheduleIcon} alt="create schedule" />
                <span>CREATE SCHEDULE</span>
              </Button>
            </Link>
            <Link to="create-examschedule">
              <Button variant="secondary" className="btn-sidebar">
                <img src={createExamScheduleIcon} alt="create exam schedule" />
                <span>CREATE EXAM SCHEDULE</span>
              </Button>
            </Link>
            <Link to="manage-curriculum">
              <Button variant="secondary" className="btn-sidebar">
                <img src={manageCurriculum} alt="manage curriculum" />
                <span>MANAGE CURRICULUM</span>
              </Button>
            </Link>
            <Link to="create-account">
              <Button variant="secondary" className="btn-sidebar">
                <img src={createAccountIcon} alt="create manage account" />
                <span>CREATE MANAGE ACCOUNT</span>
              </Button>
            </Link>
            <Link to="dashboard">
              <Button variant="secondary" className="btn-sidebar">
                <img src={dashboard} alt="dashboard" />
                <span>DASHBOARD</span>
              </Button>
            </Link>
            <Link to="room-status">
              <Button variant="secondary" className="btn-sidebar">
                <img src={roomStatus} alt="room status" />
                <span>ROOM STATUS</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-pg">
          <Routes>
            <Route index element={<CreateSchedule />} />
            <Route path="create-schedule" element={<CreateSchedule />} />
            <Route
              path="create-examschedule"
              element={<CreateExamSchedule />}
            />
            <Route path="manage-curriculum" element={<ManageCurriculum />} />
            <Route path="create-account" element={<CreateAccount />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="room-status" element={<RoomStatus />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default ProgramChairPage;
