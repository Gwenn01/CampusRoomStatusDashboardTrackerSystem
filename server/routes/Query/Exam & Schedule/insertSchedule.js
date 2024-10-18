const dbCon = require("../../connection");

module.exports = async (inputData) => {
  try {
    // Destructure input data for easier use
    const {
      course,
      semester,
      stud_year,
      section,
      instructor,
      subject_description,
      time_sched,
      room,
      day_sched,
      instructor_id,
      course_id,
    } = inputData;

    // Create a new promise for the insert query
    const queryInsertSchedule = new Promise((resolve, reject) => {
      const query = `INSERT INTO schedule(course, semester, stud_year, section, instructor, subject_description, time_sched, room, day_sched, instructor_id, course_id) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      // Execute the query with the input values
      dbCon.query(
        query,
        [
          course,
          semester,
          stud_year,
          section,
          instructor,
          subject_description,
          time_sched,
          room,
          day_sched,
          instructor_id,
          course_id,
        ],
        (err, result) => {
          if (err) {
            reject(err); // Reject the promise if there's an error
          } else {
            resolve(result); // Resolve the promise if insertion is successful
          }
        }
      );
    });

    // Wait for the promise to resolve
    const results = await queryInsertSchedule;

    return results; // Return the result to the calling function
  } catch (error) {
    // If an error occurs, throw it to be handled in the calling function
    throw error;
  }
};
