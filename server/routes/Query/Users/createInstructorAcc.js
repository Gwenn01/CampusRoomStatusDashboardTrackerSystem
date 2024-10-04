const dbCon = require("../../connection");

module.exports = async (instructorData) => {
  try {
    const {
      instructorId,
      instructorName,
      instructorUsername,
      instructorPassword,
    } = instructorData;
    // Ensure all values are provided
    if (
      !instructorId ||
      !instructorName ||
      !instructorUsername ||
      !instructorPassword
    ) {
      return { error: "All fields are required." };
    }

    const queryAddInstructor = new Promise((resolve, reject) => {
      dbCon.query(
        "INSERT INTO instructor (instructor_id, instructor_name, instructor_username, instructor_password) VALUES (?, ?, ?, ?)",
        [instructorId, instructorName, instructorUsername, instructorPassword],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    const result = await queryAddInstructor;
    return result;
  } catch (error) {
    throw error;
  }
};
