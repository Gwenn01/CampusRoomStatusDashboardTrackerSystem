import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Dropdown,
  Table,
  Button,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import "../../styles/createsched.css";

const CreateSched = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));
  // state for data from the database
  // curriculum data and filtered curriculum data
  const [data, setData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  // course data and filtered course data
  const [courseData, setCourseData] = useState([]);
  // instructor data
  const [instructorData, setInstructorData] = useState([]);
  // State for the dropdowns
  const [selectedCourse, setSelectedCourse] = useState("Select Course");
  const [selectedCousreId, setSelectedCourseId] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState("Select Semester");
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [selectedInstructor, setSelectedInstructor] =
    useState("Select Instructor");
  const [selectedSubject, setSelectedSubject] = useState("Select Subject");
  const [selectedDay, setSelectedDay] = useState("Select Day");
  const [selectedTimeFrom, setSelectedTimeFrom] = useState("Select From");
  const [selectedTimeTo, setSelectedTimeTo] = useState("Select To");
  const [selectedRoom, setSelectedRoom] = useState("Select Room");
  const [selectedSection, setSelectedSection] = useState("Select Section");
  // instructor id
  const [instructorId, setInstructorId] = useState();
  // State for the modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (code, name, units) => {
    setShow(true);
    setSelectedSubject(`${code} ${name} (${units} units)`);
  };
  const [scheduleData, setScheduleData] = useState([]);

  // fetch the schedule data from the database
  useEffect(() => {
    fetch("http://localhost:5000/api/view-schedule")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setScheduleData(data);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }, []);
  // fetch course data from the database
  useEffect(() => {
    fetch(`http://localhost:5000/api/course/${user.course_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCourseData(data);
        setSelectedCourseId(user.course_id);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }, []);
  // Fetch curriculum data from the database
  useEffect(() => {
    fetch(`http://localhost:5000/api/curriculum/${user.course_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // filtered the curriculum data base on the selected year and semester
        setData(data);
        setTempData(data);
        setDisplayData(data);
      })
      .catch((err) => console.log("Error fetching data:", err));
  }, []);

  // fetch the instructor data from the database
  useEffect(() => {
    fetch("http://localhost:5000/api/instructor")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setInstructorData(data);
      });
  }, []);

  // Handle dropdown change
  const handleCourseChange = (e) => {
    setSelectedCourse(e);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e);
    const filteredYear = data.filter((item) => item.year === e);
    setTempData(filteredYear);
    setDisplayData(filteredYear);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e);
    const filteredSemester = tempData.filter((item) => item.semester === e);
    setDisplayData(filteredSemester);
  };

  // handle add schedule
  const handleAddSchedule = async () => {
    // check if the user input is empty
    if (
      selectedCourse === "Select Course" ||
      selectedSemester === "Select Semester" ||
      selectedYear === "Select Year" ||
      selectedInstructor === "Select Instructor" ||
      selectedSubject === "Select Subject" ||
      selectedDay === "Select Day" ||
      selectedTimeFrom === "Select From" ||
      selectedTimeTo === "Select To" ||
      selectedRoom === "Select Room" ||
      selectedSection === "Select Section"
    ) {
      toast.error("Please fill all fields");
      return;
    }

    // create a new schedule object with field names matching the database
    const newSchedule = {
      course: selectedCourse,
      semester: selectedSemester,
      stud_year: selectedYear,
      section: selectedSection,
      instructor: selectedInstructor,
      subject_description: selectedSubject,
      time_sched: `${selectedTimeFrom} - ${selectedTimeTo}`,
      room: selectedRoom,
      day_sched: selectedDay,
      instructor_id: instructorId,
      course_id: selectedCousreId,
    };

    // Helper function to check schedule existence and insert if it doesn't exist
    const handleScheduleInsertion = async (day) => {
      newSchedule.day_sched = day;
      const exists = await checkIfScheduleExists(newSchedule);
      if (exists) {
        toast.error(`Schedule for ${day} already exists!`);
        return false; // Stop if schedule exists
      }
      await postNewSchedule(newSchedule); // Insert if it doesn't exist
      return true;
    };

    // Handle "MW" and "TTh" cases for multiple days
    if (selectedDay === "MW") {
      const mondayAdded = await handleScheduleInsertion("Monday");
      if (!mondayAdded) return;

      const wednesdayAdded = await handleScheduleInsertion("Wednesday");
      if (!wednesdayAdded) return;

      return;
    }

    if (selectedDay === "TTh") {
      const tuesdayAdded = await handleScheduleInsertion("Tuesday");
      if (!tuesdayAdded) return;

      const thursdayAdded = await handleScheduleInsertion("Thursday");
      if (!thursdayAdded) return;

      return;
    }

    // Check and insert schedule for single day
    const singleDayAdded = await handleScheduleInsertion(selectedDay);
    if (!singleDayAdded) return;
  };

  // Function to post new schedule to the server
  const postNewSchedule = async (newSchedule) => {
    try {
      const response = await fetch("http://localhost:5000/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSchedule),
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();
      toast.success("Schedule added successfully!");
      handleClose();
    } catch (error) {
      console.error("Error adding schedule:", error); // More detailed logging
      toast.error("Error adding schedule: " + error.message);
    }
  };

  // Function to check if the schedule exists
  const checkIfScheduleExists = async (newSchedule) => {
    // Using a simple check instead of map
    const scheduleExists = scheduleData.some((item) => {
      return (
        (item.time_sched === newSchedule.time_sched &&
          item.day_sched === newSchedule.day_sched &&
          item.room === newSchedule.room) ||
        (item.time_sched === newSchedule.time_sched &&
          item.day_sched === newSchedule.day_sched &&
          item.section === newSchedule.section)
      );
    });

    return scheduleExists;
  };

  return (
    <Container
      fluid
      className="p-4 accordion create-sched-container"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-4">Create Schedule</h1>
      <h1 className="text-center mb-4">
        {courseData.length > 0 ? `${courseData[0].course_name}` : "Loading..."}
      </h1>
      <Card className="shadow-sm p-4 mb-4 bg-white rounded">
        <Row className="mb-3">
          <Col md={6} className="mb-3">
            <h5>Select Course</h5>
            <Dropdown onSelect={(e) => handleCourseChange(e)}>
              <Dropdown.Toggle
                id="dropdown-button-program"
                variant="secondary"
                className="w-100"
              >
                {selectedCourse}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {courseData.map((item) => {
                  return (
                    <Dropdown.Item
                      eventKey={item.course_name}
                      key={item.course_id}
                    >
                      {item.course_name}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md={6} className="mb-3">
            <h5>Select Year</h5>
            <Dropdown onSelect={(e) => handleYearChange(e)}>
              <Dropdown.Toggle
                id="dropdown-button-year"
                variant="secondary"
                className="w-100"
              >
                {selectedYear}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="1stYear">1st Year</Dropdown.Item>
                <Dropdown.Item eventKey="2ndYear">2nd Year</Dropdown.Item>
                <Dropdown.Item eventKey="3rdYear">3rd Year</Dropdown.Item>
                <Dropdown.Item eventKey="4thYear">4th Year</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6} className="mb-3">
            <h5>Select Semester</h5>
            <Dropdown onSelect={(e) => handleSemesterChange(e)}>
              <Dropdown.Toggle
                id="dropdown-button-semester"
                variant="secondary"
                className="w-100"
              >
                {selectedSemester}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="1stSemester">
                  1st Semester
                </Dropdown.Item>
                <Dropdown.Item eventKey="2ndSemester">
                  2nd Semester
                </Dropdown.Item>
                <Dropdown.Item eventKey="Summer/Midyear">
                  Summer/Midyear
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md={6} className="mb-3">
            <h5>Select Instructor</h5>
            <Dropdown
              onSelect={(selectedKey) => {
                setSelectedInstructor(selectedKey); // this will set the selected instructor
                setInstructorId(
                  instructorData.find(
                    (instructor) => instructor.instructor_name === selectedKey
                  )?.instructor_id
                ); // this will set the corresponding instructor ID
              }}
            >
              <Dropdown.Toggle
                id="dropdown-button-Instructor"
                variant="secondary"
                className="w-100"
              >
                {selectedInstructor || "Select Instructor"}{" "}
              </Dropdown.Toggle>
              <Dropdown.Menu className="scrollable-dropdown">
                {instructorData.map((instructor) => {
                  return (
                    <Dropdown.Item
                      eventKey={instructor.instructor_name}
                      key={instructor.instructor_id}
                    >
                      {instructor.instructor_name}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Card>

      <Card className="shadow-sm p-4 bg-white rounded">
        <h3 className="mb-4">Curriculum</h3>
        <h5>
          {selectedYear !== "Select Year" && selectedYear}{" "}
          {selectedSemester !== "Select Semester" && selectedSemester}
        </h5>
        <Table striped bordered hover className="table-custom">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Units</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((subject, index) => (
              <tr key={index}>
                <td>{subject.code}</td>
                <td>{subject.name}</td>
                <td>{subject.units}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleShow(subject.code, subject.name, subject.units)
                    }
                  >
                    <i className="fa fa-plus" style={{ fontSize: "24px" }}></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Modal for Adding Schedule */}
      <Modal show={show} onHide={handleClose} className="modal-custom">
        <Modal.Header closeButton>
          <Modal.Title className="text-uppercase">ADD SCHEDULE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover className="table-custom-modal">
            <thead>
              <tr className="tr-modal">
                <th>Course</th>
                <th>Instructor</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              <tr className="tr-modal">
                <td>{selectedCourse}</td>
                <td>{selectedInstructor}</td>
                <td>{selectedYear}</td>
                <td>{selectedSemester}</td>
                <td>{selectedSubject}</td>
              </tr>
            </tbody>
          </Table>

          <div className="mt-3">
            <h5>Time</h5>
            <Row>
              <Col>
                <h6>From</h6>
                <Dropdown onSelect={(e) => setSelectedTimeFrom(e)}>
                  <Dropdown.Toggle
                    id="dropdown-time-from"
                    variant="secondary"
                    className="w-100"
                  >
                    {selectedTimeFrom}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="scrollable-dropdown">
                    {[
                      "7:00 AM",
                      "7:30 AM",
                      "8:00 AM",
                      "8:30 AM",
                      "9:00 AM",
                      "9:30 AM",
                      "10:00 AM",
                      "10:30 AM",
                      "11:00 AM",
                      "11:30 AM",
                      "12:00 PM",
                      "12:30 PM",
                      "1:00 PM",
                      "1:30 PM",
                      "2:00 PM",
                      "2:30 PM",
                      "3:00 PM",
                      "3:30 PM",
                      "4:00 PM",
                      "4:30 PM",
                      "5:00 PM",
                      "5:30 PM",
                      "6: 00PM",
                    ].map((time) => (
                      <Dropdown.Item
                        key={time}
                        eventKey={time}
                        className="dropdown-item"
                      >
                        {time}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col>
                <h6>To</h6>
                <Dropdown onSelect={(e) => setSelectedTimeTo(e)}>
                  <Dropdown.Toggle
                    id="dropdown-time-to"
                    variant="secondary"
                    className="w-100"
                  >
                    {selectedTimeTo}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="scrollable-dropdown">
                    {[
                      "7:00 AM",
                      "7:30 AM",
                      "8:00 AM",
                      "8:30 AM",
                      "9:00 AM",
                      "9:30 AM",
                      "10:00 AM",
                      "10:30 AM",
                      "11:00 AM",
                      "11:30 AM",
                      "12:00 PM",
                      "12:30 PM",
                      "1:00 PM",
                      "1:30 PM",
                      "2:00 PM",
                      "2:30 PM",
                      "3:00 PM",
                      "3:30 PM",
                      "4:00 PM",
                      "4:30 PM",
                      "5:00 PM",
                      "5:30 PM",
                      "6: 00PM",
                    ].map((time) => (
                      <Dropdown.Item
                        key={time}
                        eventKey={time}
                        className="dropdown-item"
                      >
                        {time}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </div>

          <div className="mt-3">
            <h5>Room</h5>
            <Dropdown onSelect={(e) => setSelectedRoom(e)}>
              <Dropdown.Toggle
                id="dropdown-room"
                variant="secondary"
                className="w-100"
              >
                {selectedRoom}
              </Dropdown.Toggle>
              <Dropdown.Menu className="scrollable-dropdown">
                {[
                  "Room 1",
                  "Room 2",
                  "Room 3",
                  "Room 4",
                  "Room 5",
                  "Room 6",
                  "Room 7",
                  "Room 8",
                  "Room 9",
                  "Room 10",
                  "Room 11",
                  "Lab 1",
                  "Lab 2",
                  "Lab 3",
                  "Lab 4",
                  "Lab 5",
                  "Lab 6",
                ].map((room) => (
                  <Dropdown.Item key={room} eventKey={room}>
                    {room}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="mt-3">
            <h5>Day</h5>
            <Dropdown onSelect={(e) => setSelectedDay(e)}>
              <Dropdown.Toggle
                id="dropdown-day"
                variant="secondary"
                className="w-100"
              >
                {selectedDay}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "MW",
                  "TTh",
                ].map((day) => (
                  <Dropdown.Item key={day} eventKey={day}>
                    {day}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="mt-3">
            <h5>Section</h5>
            <Dropdown onSelect={(e) => setSelectedSection(e)}>
              <Dropdown.Toggle
                id="dropdown-section"
                variant="secondary"
                className="w-100"
              >
                {selectedSection}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {["A", "B", "C", "D", "E", "F"].map((section) => (
                  <Dropdown.Item key={section} eventKey={section}>
                    {section}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={handleAddSchedule}>
            Add Schedule
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreateSched;
