import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Dropdown, Table } from "react-bootstrap";

const ManageCurriculum = () => {
  // for modal edit
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // state to handle the data
  const [curriculumData, setCurriculumData] = useState([]);
  const [courseCurrriculumData, setCourseCurriculumData] = useState([]);
  const [yearCurriculumData, setYearCurriculumData] = useState([]);
  const [semesterCurriculumData, setSemesterCurriculumData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [courseData, setCourseData] = useState([]);

  // selected data
  const [selectedCourse, setSelectedCourse] = useState("Select Course");
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [selectedSemester, setSelectedSemester] = useState("Select Semester");

  // get the data from database
  useEffect(() => {
    fetch("http://localhost:5000/api/course")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCourseData(data);
      })
      .catch((error) => {
        console.log("Error fetching course data:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/curriculum")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCurriculumData(data);
        setDisplayData(data);
      })
      .catch((error) => console.log("Error fetching curriculum data:", error));
  }, []);

  // handle change functions
  const handleCourseChange = (e) => {
    setSelectedCourse(e.course_name);
    console.log(e.course_name);
    console.log(e.course_id);
    const filterData = curriculumData.filter(
      (item) => item.course_id == e.course_id
    );
    console.log(filterData);
    setCourseCurriculumData(filterData);
    console.log(courseCurrriculumData);
    setDisplayData(courseCurrriculumData);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e);

    if (courseCurrriculumData) {
      setYearCurriculumData(
        courseCurrriculumData.filter((item) => item.year === e)
      );
      setDisplayData(yearCurriculumData);
    } else {
      setDisplayData(curriculumData.filter((item) => item.year === e));
      setDisplayData(yearCurriculumData);
    }
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e);
    if (courseCurrriculumData) {
      setSemesterCurriculumData(
        yearCurriculumData.filter((item) => item.semester === e)
      );
      setDisplayData(semesterCurriculumData);
    } else if (yearCurriculumData) {
      setSemesterCurriculumData(
        yearCurriculumData.filter((item) => item.semester === e)
      );
      setDisplayData(semesterCurriculumData);
    } else {
      setDisplayData(curriculumData.filter((item) => item.semester === e));
      setDisplayData(semesterCurriculumData);
    }
  };

  return (
    <Container
      fluid
      className="p-4 accordion create-sched-container"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Row className="mb-3">
        <Col md={6} className="mb-3" style={{ width: "400px" }}>
          <h5>Select Course</h5>
          <Dropdown onSelect={(e) => handleCourseChange(JSON.parse(e))}>
            <Dropdown.Toggle
              id="dropdown-button-program"
              variant="secondary"
              className="w-100"
            >
              {selectedCourse}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {courseData.map((item) => (
                <Dropdown.Item
                  eventKey={JSON.stringify(item)}
                  key={item.course_id}
                >
                  {item.course_name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={6} className="mb-3" style={{ width: "400px" }}>
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
        <Col md={6} className="mb-3" style={{ width: "400px" }}>
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
              <Dropdown.Item eventKey="1stSemester">1st Semester</Dropdown.Item>
              <Dropdown.Item eventKey="2ndSemester">2nd Semester</Dropdown.Item>
              <Dropdown.Item eventKey="Summer/Midyear">
                Summer/Midyear
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row className="p-2">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Units</th>
              <th>Year</th>
              <th>Semester</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((curriculum, index) => (
              <tr key={index}>
                <td>{curriculum.code}</td>
                <td>{curriculum.name}</td>
                <td>{curriculum.units}</td>
                <td>{curriculum.year}</td>
                <td>{curriculum.semester}</td>
                <td className="d-flex justify-content-around">
                  <Button variant="primary" className="h-100 w-100">
                    Edit
                  </Button>
                  <Button variant="danger" className="h-100 w-100">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default ManageCurriculum;
