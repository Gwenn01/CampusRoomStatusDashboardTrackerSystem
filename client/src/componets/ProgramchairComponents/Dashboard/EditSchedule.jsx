import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";

const EditSchedule = () => {
  const { id } = useParams(); // Get the schedule ID from the URL
  const navigate = useNavigate();
  const [scheduleItem, setScheduleItem] = useState(null);

  // Fetch the schedule to be edited
  useEffect(() => {
    fetch(`http://localhost:5000/api/view-schedulee/${id}`)
      .then((response) => response.json())
      .then((data) => setScheduleItem(data))
      .catch((error) => console.error(error));
  }, [id]); // Runs only when 'id' changes

  const handleChange = (e) => {
    setScheduleItem({
      ...scheduleItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/edit-schedule/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleItem),
    })
      .then(() => toast.success("Schedule updated successfully"))
      .then(() => navigate("/programchair/dashboard/view-schedule"))
      .catch((error) => console.error(error));
  };

  if (!scheduleItem) return <p>Loading...</p>;

  return (
    <Container className="p-4">
      <h1>Edit Schedule</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="subject">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            name="subject_description"
            value={scheduleItem.subject_description || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="instructor">
          <Form.Label>Instructor</Form.Label>
          <Form.Control
            type="text"
            name="instructor"
            value={scheduleItem.instructor || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="instructor">
          <Form.Label>Instructor ID</Form.Label>
          <Form.Control
            type="text"
            name="instructor"
            value={scheduleItem.instructor_id || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="time_sched">
          <Form.Label>Time Schedule</Form.Label>
          <Form.Control
            type="text"
            name="time_sched"
            value={scheduleItem.time_sched || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="room">
          <Form.Label>Room</Form.Label>
          <Form.Control
            type="text"
            name="room"
            value={scheduleItem.room || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="day_sched">
          <Form.Label>Day</Form.Label>
          <Form.Control
            as="select"
            name="day_sched"
            value={scheduleItem.day_sched || "Monday"} // Ensure value is set
            onChange={handleChange}
            required
          >
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Sturday</option>
          </Form.Control>
        </Form.Group>
        <Button type="submit" className="mt-4">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default EditSchedule;
