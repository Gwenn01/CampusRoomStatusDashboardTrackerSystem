import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectUser from "../pages/SelectUser";
import Login from "../pages/Login";
import StudentPages from "../pages/StudentPage";
import InstructorPage from "../pages/InstructorPage";
import ProgramChairPage from "../pages/ProgramchairPage";
import ProtectedRoute from "../componets/ProtectedRoute";

const Layout = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SelectUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<StudentPages />} />
          <Route
            path="/instructor/*"
            element={
              <ProtectedRoute>
                <InstructorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/programchair/*"
            element={
              <ProtectedRoute>
                <ProgramChairPage />
              </ProtectedRoute>
            }
          />
          <Route path="/student/*" element={<StudentPages />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Layout;
