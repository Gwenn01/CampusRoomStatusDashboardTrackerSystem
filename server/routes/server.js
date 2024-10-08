const route = require("express").Router();
const dbCon = require("./connection");
// querying data in the databse
const instructorData = require("./Query/Users/instructorData");
const programchairData = require("./Query/Users/programchairData");
const curriculumData = require("./Query/Curriculum/curriculumData");
const insertSchedule = require("./Query/Exam & Schedule/insertSchedule");
const scheduleData = require("./Query/Exam & Schedule/scheduleData");
const sheduleDataByYear = require("./Query/Exam & Schedule/getScheduleByYear");
const editScheduleData = require("./Query/Exam & Schedule/editScheduleData");
const editSchedule = require("./Query/Exam & Schedule/editSchedule");
const deleteSchedule = require("./Query/Exam & Schedule/deleteSchedule");
const insertExamSchedule = require("./Query/Exam & Schedule/insertExamSchedule");
const viewExamSchedule = require("./Query/Exam & Schedule/viewExamSchedule");
const editExamScheduleData = require("./Query/Exam & Schedule/editExamScheduleData");
const editExamSchedule = require("./Query/Exam & Schedule/editExamSchedule");
const deleteExamSchedule = require("./Query/Exam & Schedule/deleteExamSchedule");
const createInstructorAcc = require("./Query/Users/createInstructorAcc");
const roomData = require("./Query/Room/roomData");
const updateRoomStatus = require("./Query/Room/updateRoomStatus");
const reportData = require("./Query/Reports/reportsData");
const editInstructor = require("./Query/Users/editInstructor");
const deleteInstructor = require("./Query/Users/deleteInstructor");
// api testing
route.get("/", (req, res) => {
  res.json("Hello World");
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
route.get("/curriculum", async (req, res) => {
  try {
    const curriculum = await curriculumData();
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
route.get("/view-schedule/:year", async (req, res) => {
  try {
    const year = req.params.year;
    const resultScheduleByYear = await sheduleDataByYear(year);
    if (year == "1stYear") {
      res.status(200).json({ "1st Year": resultScheduleByYear });
    } else if (year == "2ndYear") {
      res.status(200).json({ "2nd Year": resultScheduleByYear });
    } else if (year == "3rdYear") {
      res.status(200).json({ "3rd Year": resultScheduleByYear });
    } else if (year == "4thYear") {
      res.status(200).json({ "4th Year": resultScheduleByYear });
    }
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching data",
      details: error.message,
    });
  }
});
// Data to be edited
route.get("/view-schedule/:id", async (req, res) => {
  const scheduleId = req.params.id; // Get the ID from the request parameters
  try {
    const scheduleTobeEdited = await editScheduleData(scheduleId);
    res.status(200).json(scheduleTobeEdited);
  } catch (error) {
    res.statur(500).json({
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
// Data to be edited
route.get("/view-exam-schedule/:id", async (req, res) => {
  const scheduleId = req.params.id; // Get the ID from the request parameters
  try {
    const examScheduleTobeEdited = await editExamScheduleData(scheduleId);
    res.status(200).json(examScheduleTobeEdited);
  } catch (error) {
    res.statur(500).json({
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
    const { room_id, status } = req.body;
    const roomStatusReseult = await updateRoomStatus(room_id, status);
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

module.exports = route;

/* curriculum data
const curriculumIT = {
  "1stYear": [
    {
      "1stSemester": [
        { Code: "EN+", Name: "Enhanced Communication Skills", Units: 3 },
        { Code: "CC101", Name: "Introduction to Computing", Units: 3 },
        {
          Code: "NSTP1",
          Name: "National Service Training Program 1",
          Units: 3,
        },
        {
          Code: "PE 1B",
          Name: "Physical Activities Toward Health and Fitness",
          Units: 2,
        },
        { Code: "GEC 7", Name: "Science Technology and Society", Units: 3 },
        { Code: "GEC 1", Name: "Understanding the Self", Units: 3 },
        {
          Code: "FKN 1",
          Name: "Kontekswalisadong Komunikasyon sa Filipno",
          Units: 3,
        },
      ],
    },
    {
      "2ndSemester": [
        { Code: "NSTP2C", Name: "Civic Welfare Training Service II", Units: 3 },
        {
          Code: "PE 2B",
          Name: "Physical Activities Toward Health and Fitness 2",
          Units: 2,
        },
        {
          Code: "GEC 2A",
          Name: "Reading in the Philippine History (with IP Education)",
          Units: 3,
        },
        { Code: "GEC 4", Name: "Mathematics in the Modern World", Units: 3 },
        {
          Code: "HCI 101",
          Name: "Introduction to Human-Computer Interaction",
          Units: 3,
        },
        { Code: "GEC 5", Name: "Purposive Communication", Units: 3 },
        { Code: "CC 102", Name: "Computer Programming 1", Units: 3 },
        { Code: "ITES 102", Name: "Computer Hardware System", Units: 3 },
      ],
    },
  ],
  "2ndYear": [
    {
      "1stSemester": [
        {
          Code: "PE 30IC",
          Name: "Physical Activities Toward Health and Fitness 3",
          Units: 2,
        },
        { Code: "MS 101", Name: "Discrete Mathematics", Units: 3 },
        {
          Code: "GEC 3c",
          Name: "The Contempory World (Peace Education)",
          Units: 3,
        },
        { Code: "GEE 1S", Name: "ASEAN Culture Studies", Units: 3 },
        {
          Code: "ITE 1",
          Name: "IT Elective 1-Web Systems and Technologies",
          Units: 3,
        },
        { Code: "GEM", Name: "The  Life and Works of Rizal", Units: 3 },
        { Code: "CC 103", Name: "Computer Programming II", Units: 3 },
      ],
    },
    {
      "2ndSemester": [
        {
          Code: "PE 401D",
          Name: "Physical Activities Toward Health and Fitness 4",
          Units: 2,
        },
        { Code: "GEC 6", Name: "Art Appreciation", Units: 3 },
        { Code: "GEE 7", Name: "Gender and Society", Units: 3 },
        { Code: "GEE 14", Name: "TechoEnterpreneurship", Units: 3 },
        { Code: "CC 105", Name: "Information Management", Units: 3 },
        {
          Code: "ITE 2",
          Name: "IT Elective 2 Object-Oriented Programming",
          Units: 3,
        },
        { Code: "CC 104", Name: "Data Structure and Algorithms", Units: 3 },
      ],
    },
  ],
  "3rdYear": [
    {
      "1stSemester": [
        {
          Code: "ITP",
          Name: "Integrative Programming Technologies 1",
          Units: 3,
        },
        { Code: "PF 102", Name: "Evet Driven Programming", Units: 3 },
        {
          Code: "ITE 3",
          Name: "IT Elective 3 Platform Technologies",
          Units: 3,
        },
        { Code: "EN 1", Name: "Scientific And Technical Writing", Units: 3 },
        {
          Code: "GDDAT",
          Name: "Game Development and Digital Animation Technology",
          Units: 3,
        },
        { Code: "IM 101", Name: "Advance Database Systems", Units: 3 },
      ],
    },
    {
      "2ndSemester": [
        { Code: "GEC 8", Name: "Ethics", Units: 3 },
        {
          Code: "ITE 4",
          Name: "IT Elective 4 Aftificial Intelligence",
          Units: 3,
        },
        {
          Code: "IAS 101",
          Name: "Information Assurance and Security",
          Units: 3,
        },
        { Code: "NET 101", Name: "Networking 1", Units: 3 },
        {
          Code: "CC 106",
          Name: "Application Development and Emerging Technologies",
          Units: 3,
        },
        {
          Code: "SIA 101",
          Name: "System Integration and Architecture 1",
          Units: 3,
        },
        { Code: "CAP 101", Name: "Capstone Project and Research1", Units: 3 },
      ],
    },
    {
      "Summer/Midyear": [
        { Code: "NET 102", Name: "Networking 2", Units: 3 },
        { Code: "SP 101", Name: "Social Issues and Professional", Units: 3 },
        { Code: "MS 102", Name: "Quantitative Methods", Units: 3 },
      ],
    },
  ],
  "4thYear": [
    {
      "1stSemester": [
        { Code: "FLBG", Name: "Foreign Language", Units: 3 },
        { Code: "CAP 102", Name: "Capstone Project and Reasearch 2", Units: 3 },
        {
          Code: "SA 101",
          Name: "System Administrator and Maintenace",
          Units: 3,
        },
      ],
    },
    {
      "2ndSemester": [
        { Code: "PRAC 101", Name: "Practicum (600hours)", Units: 3 },
      ],
    },
  ],
};*/
