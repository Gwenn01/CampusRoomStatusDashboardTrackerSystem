const route = require("express").Router();
const dbCon = require("./connection");
// querying data in the databse
const courseData = require("./Query/Course/getCourse");
const instructorData = require("./Query/Users/instructorData");
const editInstructor = require("./Query/Users/editInstructor");
const deleteInstructor = require("./Query/Users/deleteInstructor");
const programchairData = require("./Query/Users/programchairData");
const curriculumData = require("./Query/Curriculum/curriculumData");
const insertSchedule = require("./Query/Exam & Schedule/insertSchedule");
const scheduleData = require("./Query/Exam & Schedule/scheduleData");
const getSheduleDataByInstructor = require("./Query/Exam & Schedule/getScheduleByInstructor");
const getScheduleDataByCourseYearSection = require("./Query/Exam & Schedule/getScheduleDataByCourseYearSection");
const getExamScheduleDataByCourseYearSection = require("./Query/Exam & Schedule/getExamScheduleDataByCourseYearSection");
const editScheduleData = require("./Query/Exam & Schedule/editScheduleData");
const editSchedule = require("./Query/Exam & Schedule/editSchedule");
const deleteSchedule = require("./Query/Exam & Schedule/deleteSchedule");
const insertExamSchedule = require("./Query/Exam & Schedule/insertExamSchedule");
const viewExamSchedule = require("./Query/Exam & Schedule/viewExamSchedule");
const getExamSheduleDataByInstructor = require("./Query/Exam & Schedule/getExamScheduleByInstructor");
const editExamScheduleData = require("./Query/Exam & Schedule/editExamScheduleData");
const editExamSchedule = require("./Query/Exam & Schedule/editExamSchedule");
const deleteExamSchedule = require("./Query/Exam & Schedule/deleteExamSchedule");
const createInstructorAcc = require("./Query/Users/createInstructorAcc");
const roomData = require("./Query/Room/roomData");
const updateRoomStatus = require("./Query/Room/updateRoomStatus");
const reportData = require("./Query/Reports/reportsData");
const insertReports = require("./Query/Reports/insertReports");

// api testing
route.get("/", (req, res) => {
  res.json("Hello World");
});
// COURSE API
route.get("/course/:id", async (req, res) => {
  try {
    const course_id = req.params.id;
    const resultCourse = await courseData(course_id);
    res.status(200).json(resultCourse);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching data",
      details: err.message,
    });
  }
});

// LOGIN API
route.get("/login", async (req, res) => {
  try {
    // Call the function to get data from the database
    const instructor = await instructorData();
    const programchair = await programchairData();
    // Combine the data from both tables
    const loginData = { ...instructor, ...programchair };
    // Send the data as JSON response
    res.status(200).json(loginData);
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while fetching data",
      details: err.message,
    });
  }
});
// CURRICULUM API
route.get("/curriculum/:id", async (req, res) => {
  try {
    const course_id = req.params.id;
    const curriculum = await curriculumData(course_id);
    res.status(200).json(curriculum);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching data",
      details: error.message,
    });
  }
});
// INSTRUCTOR API
route.get("/instructor", async (req, res) => {
  try {
    const instructor = await instructorData();
    const convertedInstructorArray = instructor.instructor;
    res.status(200).json(convertedInstructorArray);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching data",
      details: error.message,
    });
  }
});
// edit the instructo data
route.put("/edit-instructor/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const toBeEditValue = req.body;
    const resultInstructor = await editInstructor(id, toBeEditValue);
    res.status(200).json(resultInstructor);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating instructor data",
      details: error.message,
    });
  }
});
// delete instructor
route.delete("/delete-instructor/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteInstructor(id);
    res.status(200).json({
      message: "Instructor deleted successfully",
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while deleting the instructor",
      details: error.message,
    });
  }
});
// SCHEDULE API
// Insert schedule
route.post("/schedule", async (req, res) => {
  const inputData = req.body;
  try {
    const scheduleData = await insertSchedule(inputData);
    res.status(200).json(scheduleData);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while inserting schedule data",
      details: error.message,
    });
  }
});
// Get the data from schedule table
route.get("/view-schedule", async (req, res) => {
  try {
    const schedule = await scheduleData();
    res.status(200).json(schedule);
  } catch (error) {
    res.statur(500).json({
      error: "An error occurred while fetching data",
      details: error.message,
    });
  }
});
// get data from schedule table by year
route.get("/view-schedule/:instructor", async (req, res) => {
  try {
    const instructor = req.params.instructor;
    const resultInstructorSchedule = await getSheduleDataByInstructor(
      instructor
    );
    res.status(200).json(resultInstructorSchedule);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching data",
      details: error.message,
    });
  }
});
// get data from schedule table by course year and section
route.get("/view-schedule/:course/:year/:section", async (req, res) => {
  try {
    const course = req.params.course;
    const year = req.params.year;
    const section = req.params.section;
    const resultExamSchedule = await getScheduleDataByCourseYearSection(
      course,
      year,
      section
    );
    res.status(200).json(resultExamSchedule);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching data",
      details: error.message,
    });
  }
});
// Data to be edited
route.get("/view-schedulee/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const resultScheduleToBeEdited = await editScheduleData(id);
    const convert = resultScheduleToBeEdited[0];
    res.status(200).json(convert);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching data",
      details: error.message,
    });
  }
});

// Edit the data from schedule table
route.put("/edit-schedule/:id", async (req, res) => {
  const scheduleId = req.params.id;
  const updatedData = req.body;
  try {
    const resultEditSchedule = await editSchedule(scheduleId, updatedData);
    res.status(200).json(resultEditSchedule);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating schedule data",
      details: error.message,
    });
  }
});
// DELETE schedule by ID
route.delete("/delete-schedule/:id", async (req, res) => {
  const scheduleId = req.params.id;
  try {
    const resultDeleteSchedule = await deleteSchedule(scheduleId);
    res.status(200).json(resultDeleteSchedule);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while deleting schedule data",
      details: error.message,
    });
  }
});
// EXAM SCHEDULE API
// Insert exam schedule
route.post("/exam-schedule", async (req, res) => {
  try {
    const scheduleData = req.body;
    const resultInsertExam = insertExamSchedule(scheduleData);
    res.status(200).json(resultInsertExam);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while inserting schedule data",
      details: error.message,
    });
  }
});
// Get exam schedule
route.get("/view-exam-schedule", async (req, res) => {
  try {
    const resultGetExam = await viewExamSchedule();
    res.status(200).json(resultGetExam);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching schedule data",
      details: error.message,
    });
  }
});
// get data from schedule table by year
route.get("/view-exam-schedule/:instructor", async (req, res) => {
  try {
    const instructor = req.params.instructor;
    const resultInstructorScheduleExam = await getExamSheduleDataByInstructor(
      instructor
    );
    res.status(200).json(resultInstructorScheduleExam);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching data",
      details: error.message,
    });
  }
});
// get data from schedule table by course year and section
route.get("/view-exam-schedule/:course/:year/:section", async (req, res) => {
  try {
    const course = req.params.course;
    const year = req.params.year;
    const section = req.params.section;
    const resultExamSchedule = await getExamScheduleDataByCourseYearSection(
      course,
      year,
      section
    );
    res.status(200).json(resultExamSchedule);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching data",
      details: error.message,
    });
  }
});
// Data to be edited
route.get("/view-exam-schedulee/:id", async (req, res) => {
  const scheduleId = req.params.id; // Get the ID from the request parameters
  try {
    const examScheduleTobeEdited = await editExamScheduleData(scheduleId);
    res.status(200).json(examScheduleTobeEdited);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching data",
      details: error.message,
    });
  }
});
// Edit the data from schedule table
route.put("/edit-exam-schedule/:id", async (req, res) => {
  const scheduleId = req.params.id;
  const updatedData = req.body;
  try {
    const resultEditExamSchedule = await editExamSchedule(
      scheduleId,
      updatedData
    );
    res.status(200).json(resultEditExamSchedule);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating schedule data",
      details: error.message,
    });
  }
});
// DELETE exam schedule by ID
route.delete("/delete-exam-schedule/:id", async (req, res) => {
  const scheduleId = req.params.id;
  try {
    const resultDeleteExamSchedule = await deleteExamSchedule(scheduleId);
    res.status(200).json(resultDeleteExamSchedule);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while deleting schedule data",
      details: error.message,
    });
  }
});
// CREATE INSTRUCTOR ACCOUNT
route.post("/add-instructor-account", async (req, res) => {
  try {
    const instructorData = req.body;
    const resultCreateInstructorAccount = await createInstructorAcc(
      instructorData
    );
    res.status(200).json(resultCreateInstructorAccount);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while creating instructor account",
      details: error.message,
    });
  }
});

// ROOM API
// Get the room
route.get("/get-rooms", async (req, res) => {
  try {
    const resultGetRooms = await roomData();
    res.status(200).json(resultGetRooms);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while getting room data",
      details: error.message,
    });
  }
});
// Update room status
route.put("/update-room-status", async (req, res) => {
  try {
    const { room_id, status, instructorName, timeIn } = req.body;
    const roomStatusReseult = await updateRoomStatus(
      room_id,
      status,
      instructorName,
      timeIn
    );
    res.status(200).json(roomStatusReseult);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating room status",
      details: error.message,
    });
  }
});
// REPORTS DATA
route.get("/report-data", async (req, res) => {
  try {
    const resultReportsData = await reportData();
    res.status(200).json(resultReportsData);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while getting reports data",
      details: error.message,
    });
  }
});
route.post("/insert-report-data", async (req, res) => {
  try {
    const {
      room_name,
      instructor_name,
      time_in,
      time_out,
      instructor_id,
      date_reports,
    } = req.body;
    const resultInsertReportData = await insertReports(
      room_name,
      instructor_name,
      time_in,
      time_out,
      instructor_id,
      date_reports
    );
    res.status(200).json(resultInsertReportData);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while getting reports data",
      details: error.message,
    });
    console.log(error.message);
  }
});

module.exports = route;
