const dbCon = require("../../connection");

module.exports = async (id) => {
  try {
    const instructorId = id;
    const queryDeleteInstructor = new Promise((resolve, reject) => {
      dbCon.query(
        `DELETE FROM instructor WHERE instructor_id = ?`,
        [instructorId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    const result = await queryDeleteInstructor;
    return result;
  } catch (error) {
    throw error;
  }
};
