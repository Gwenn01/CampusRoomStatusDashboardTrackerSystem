const dbCon = require("../../connection");

module.exports = async (id, toBeEditValue) => {
  try {
    const {
      instructorId,
      instructorName,
      instructorUsername,
      instructorPassword,
    } = toBeEditValue;

    const quryEditInstructor = new Promise((resolve, reject) => {
      dbCon.query(
        `UPDATE instructor SET instructor_id = ?, instructor_name = ?, instructor_username = ?, instructor_password = ? WHERE instructor_id = ?`,
        [
          instructorId,
          instructorName,
          instructorUsername,
          instructorPassword,
          id,
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    const result = await quryEditInstructor;
    return result;
  } catch (error) {
    throw error;
  }
};
