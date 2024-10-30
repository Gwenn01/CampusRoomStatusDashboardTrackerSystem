import React from "react";
import { useLocation, Link, Route, Routes } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "../styles/instructor.css";
import Header from "../shared/partition/Header";
import Dashboard from "../componets/StudentComponents/Dashboard";
import TodaySchedule from "../componets/StudentComponents/TodaySchedule";
import RoomStatus from "../componets/StudentComponents/Roomstatus";
// icons
import dashboard from "../assets/dashboard.png";
import roomStatus from "../assets/roomstatus.png";
import todaySched from "../assets/today-schedule.png";

const StudentPage = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));

  return (
    <>
      <Header />
      <div className="container-pg">
        <div className="sidebar">
          <div className="container-sidebarbtns">
            <Link to="dashboard">
              <Button variant="secondary" className="btn-sidebar">
                <img src={dashboard} alt="dashboard" />
                <span>DASHBOARD</span>
              </Button>
            </Link>
            <Link to="today-sched">
              <Button variant="secondary" className="btn-sidebar">
                <img src={todaySched} alt="today schedule" />
                <span>TODAY SCHEDULE</span>
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
            <Route index element={<RoomStatus />} />
            <Route path="dashboard/*" element={<Dashboard />} />
            <Route path="today-sched" element={<TodaySchedule />} />
            <Route path="room-status" element={<RoomStatus />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default StudentPage;
