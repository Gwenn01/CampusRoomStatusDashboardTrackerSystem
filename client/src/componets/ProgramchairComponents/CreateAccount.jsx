import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";

const CreateAccount = () => {
  // for modal edit
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Defining state for each input field
  const [instructorId, setInstructorId] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [instructorUsername, setInstructorUsername] = useState("");
  const [instructorPassword, setInstructorPassword] = useState("");
  // Instructor data array
  const [instructorData, setInstructorData] = useState([]);
  const [instructorToBeEdited, setInstructorToBeEdited] = useState(null);
  // value to be edited
  const [editinstructorId, seteditInstructorId] = useState("");
  const [editinstructorName, seteditInstructorName] = useState("");
  const [editinstructorUsername, seteditInstructorUsername] = useState("");
  const [editinstructorPassword, seteditInstructorPassword] = useState("");

  // Function to handle form submission and inserting data into the database
  const handleAddAccount = () => {
    if (
      instructorId &&
      instructorName &&
      instructorUsername &&
      instructorPassword
    ) {
      // Data to be added
      const newInstructorData = {
        instructorId: instructorId,
        instructorName: instructorName,
        instructorUsername: instructorUsername,
        instructorPassword: instructorPassword,
      };
      // API call to add instructor
      fetch("http://localhost:5000/api/add-instructor-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInstructorData),
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error("Failed to add instructor");
        })
        .then(() => {
          toast.success("Instructor account created successfully!");
          setInstructorId("");
          setInstructorName("");
          setInstructorUsername("");
          setInstructorPassword("");
          fetchInstructorData(); // Reload instructor data after adding
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Error creating account.");
        });
    } else {
      toast.error("Please fill in all fields.");
    }
  };

  // Fetch instructor data from database
  const fetchInstructorData = () => {
    fetch("http://localhost:5000/api/instructor")
      .then((response) => response.json())
      .then((data) => setInstructorData(data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    fetchInstructorData();
  }, []);

  // Handle edit account: populate modal with instructor data
  const handleEditAccount = (
    instructorID,
    instructorName,
    instructorUsername,
    instructorPassword
  ) => {
    handleShow(); // Show modal
    // Set values to be edited
    setInstructorToBeEdited(instructorID);
    seteditInstructorId(instructorID);
    seteditInstructorName(instructorName);
    seteditInstructorUsername(instructorUsername);
    seteditInstructorPassword(instructorPassword);
  };

  // Handle the form submission for editing an instructor
  const handleEditAccountSubmit = () => {
    const updatedInstructor = {
      instructorId: editinstructorId,
      instructorName: editinstructorName,
      instructorUsername: editinstructorUsername,
      instructorPassword: editinstructorPassword,
    };
    const id = instructorToBeEdited;
    fetch(`http://localhost:5000/api/edit-instructor/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedInstructor),
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Failed to update instructor");
      })
      .then(() => {
        toast.success("Instructor account updated successfully!");
        handleClose(); // Close modal
        fetchInstructorData(); // Reload data
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to update account.");
      });
  };
  // Handle the form submission for deleting an instructor
  const handleDeleteAccount = (deleteId) => {
    const id = deleteId;

    // Confirm deletion
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      fetch(`http://localhost:5000/api/delete-instructor/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            toast.success("Instructor deleted successfully!");
            // Fetch updated instructor data to reflect changes
            fetchInstructorData();
          } else {
            throw new Error("Failed to delete instructor");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("An error occurred while deleting the instructor.");
        });
    }
  };

  return (
    <Container
      fluid
      className="p-4 accordion create-sched-container"
      style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
    >
      <h1>Create Instructor Account</h1>
      <Row>
        <Col>
          <FloatingLabel
            controlId="floatingInputId"
            label="Enter Instructor ID"
            className="mb-3"
          >
            <Form.Control
              type="number"
              placeholder="2411"
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel
            controlId="floatingInputName"
            label="Enter Instructor Name"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Instructor Name"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col>
          <FloatingLabel
            controlId="floatingInputUsername"
            label="Enter Instructor Username"
            className="mb-3"
          >
            <Form.Control
              type="email"
              placeholder="instructor@username"
              value={instructorUsername}
              onChange={(e) => setInstructorUsername(e.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel
            controlId="floatingInputPassword"
            label="Enter Instructor Password"
            className="mb-3"
          >
            <Form.Control
              type="password"
              placeholder="123"
              value={instructorPassword}
              onChange={(e) => setInstructorPassword(e.target.value)}
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row className="p-2">
        <Button variant="secondary" onClick={handleAddAccount}>
          Add Account
        </Button>
      </Row>
      <Row className="pt-2">
        <h1>Manage Accounts</h1>
      </Row>
      <Row className="p-2">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Instructor ID</th>
              <th>Instructor Name</th>
              <th>Instructor Username</th>
              <th>Instructor Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructorData.map((instructor, index) => {
              return (
                <tr key={index}>
                  <td>{instructor.instructor_id}</td>
                  <td>{instructor.instructor_name}</td>
                  <td>{instructor.instructor_username}</td>
                  <td>{instructor.instructor_password}</td>
                  <td className="d-flex justify-content-around">
                    <Button
                      variant="primary"
                      className="h-100 w-100"
                      onClick={() =>
                        handleEditAccount(
                          instructor.instructor_id,
                          instructor.instructor_name,
                          instructor.instructor_username,
                          instructor.instructor_password
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="h-100 w-100"
                      onClick={() =>
                        handleDeleteAccount(instructor.instructor_id)
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Row>
      {/* Modal for editing instructor */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Instructor Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Instructor ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Instructor ID"
                value={editinstructorId}
                onChange={(e) => seteditInstructorId(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instructor Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Instructor Name"
                value={editinstructorName}
                onChange={(e) => seteditInstructorName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instructor Username</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Instructor Username"
                value={editinstructorUsername}
                onChange={(e) => seteditInstructorUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instructor Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Instructor Password"
                value={editinstructorPassword}
                onChange={(e) => seteditInstructorPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditAccountSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreateAccount;
