import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Modal,
  Form,
  FloatingLabel,
  Button,
  Container,
  Row,
  Col,
  Dropdown,
  Table,
} from "react-bootstrap";
import { toast } from "react-toastify";

const ManageCurriculum = () => {
  // user data
  const location = useLocation();
  const { userData } = location.state || {};
  const user = userData || JSON.parse(localStorage.getItem("userData"));
  // for modal edit
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // data to be add
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [units, setUnits] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  // state to handle the data
  const [curriculumData, setCurriculumData] = useState([]);
  const [tempCurriculumData, setTempCurriculumData] = useState([]);
  const [displayCurriculumData, setDisplayCurriculumData] = useState([]);
  const [courseData, setCourseData] = useState([]);

  // selected data
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [selectedSemester, setSelectedSemester] = useState("Select Semester");
  // state for edit curriculum
  const [selectedID, setSelectedID] = useState(0);
  const [selectedCode, setSelectedCode] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedUnits, setSelectedUnits] = useState("");
  const [selectedYearEdit, setSelectedYearEdit] = useState("");
  const [selectedSemesterEdit, setSelectedSemesterEdit] = useState("");

  // get the data from database
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
      })
      .catch((error) => {
        console.log("Error fetching course data:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/curriculum/${user.course_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCurriculumData(data);
        setTempCurriculumData(data);
        setDisplayCurriculumData(data);
      })
      .catch((error) => console.log("Error fetching curriculum data:", error));
  }, []);
  // handle the add curriculum
  const handleAddCurriculum = async () => {
    const newCurriculumData = {
      code: code,
      name: name,
      units: units,
      year: year,
      semester: semester,
      course_id: user.course_id,
    };
    try {
      const response = await fetch(
        "http://localhost:5000/api/insert-curriculum",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCurriculumData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();
      toast.success("Curriculum added successfully!", result);
    } catch (error) {
      console.error("Error adding curriculum:", error); // More detailed logging
      toast.error("Error adding curriculum: " + error.message);
    }
  };

  // handle change functions
  const handleYearChange = (e) => {
    setSelectedYear(e);
    const filteredYear = curriculumData.filter((item) => item.year === e);
    setTempCurriculumData(filteredYear);
    setDisplayCurriculumData(filteredYear);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e);
    const filteredSemester = tempCurriculumData.filter(
      (item) => item.semester === e
    );
    setDisplayCurriculumData(filteredSemester);
  };
  // handle edit to bed edited
  const handleEdit = (curriculum) => {
    handleShow();
    setSelectedID(curriculum.id);
    setSelectedCode(curriculum.code);
    setSelectedName(curriculum.name);
    setSelectedUnits(curriculum.units);
    setSelectedYearEdit(curriculum.year);
    setSelectedSemesterEdit(curriculum.semester);
  };
  // handle edit submit and handle delet submit
  const handleEditSubmit = () => {
    const updatedCurriculumData = {
      code: selectedCode,
      name: selectedName,
      units: selectedUnits,
      year: selectedYearEdit,
      semester: selectedSemesterEdit,
    };
    const id = selectedID;
    fetch(`http://localhost:5000/api/update-curriculum/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCurriculumData),
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Failed to update curriculum");
      })
      .then(() => {
        toast.success("Curriculum updated successfully!");
        handleClose(); // Close modal
        window.location.reload(); // Reload the page
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to update Curriculum.");
      });
  };
  const handleDeleteSubmit = (deleteId) => {
    const id = deleteId;
    if (window.confirm("Are you sure you want to delete this curriculum?")) {
      fetch(`http://localhost:5000/api/delete-curriculum/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            toast.success("Cyrruculum deleted successfully!");
            window.location.reload();
          } else {
            throw new Error("Failed to delete curriculum");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("An error occurred while deleting the curriculum.");
        });
    }
  };

  return (
    <Container
      fluid
      className="p-4 accordion create-sched-container"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1 className="text-center mb-4">
        {courseData.length > 0
          ? `${courseData[0].course_name} Currriculum`
          : "Loading..."}
      </h1>
      <Row>
        <Col>
          <FloatingLabel
            controlId="floatingInputCode"
            label="Enter Code"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Enter Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel
            controlId="floatingInputName"
            label="Enter Name"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col>
          <FloatingLabel
            controlId="floatingInputUnits"
            label="Enter Units"
            className="mb-3"
          >
            <Form.Control
              type="number"
              placeholder="Enter Units"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel
            controlId="floatingInputYear"
            label="Enter Year"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Enter Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col>
          <FloatingLabel
            controlId="floatingInputSemester"
            label="Enter Semester"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Enter Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row className="p-2">
        <Button variant="secondary" onClick={handleAddCurriculum}>
          Add Curriculum
        </Button>
      </Row>
      <Row className="mb-3">
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
            {displayCurriculumData.map((curriculum, index) => (
              <tr key={index}>
                <td>{curriculum.code}</td>
                <td>{curriculum.name}</td>
                <td>{curriculum.units}</td>
                <td>{curriculum.year}</td>
                <td>{curriculum.semester}</td>
                <td className="d-flex justify-content-around">
                  <Button
                    variant="primary"
                    className="h-100 w-100"
                    onClick={() => handleEdit(curriculum)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="h-100 w-100"
                    onClick={() => handleDeleteSubmit(curriculum.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      {/* Modal for editing instructor */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Curriculum Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Curriculum Code"
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Curriculum Name"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Units</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Curriculum Units"
                value={selectedUnits}
                onChange={(e) => setSelectedUnits(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Curriculum Year"
                value={selectedYearEdit}
                onChange={(e) => setSelectedYearEdit(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Semester</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Curriculum Semester"
                value={selectedSemesterEdit}
                onChange={(e) => setSelectedSemesterEdit(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageCurriculum;
