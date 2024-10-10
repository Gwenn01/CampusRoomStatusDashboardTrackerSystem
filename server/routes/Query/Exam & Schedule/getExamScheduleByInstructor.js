const dbCon = require("../../connection");

module.exports = async (instructor) => {
  try {
    const queryInstructor = new Promise((resolve, reject) => {
      dbCon.query(
        "SELECT * FROM examschedule WHERE instructor = ?",
        [instructor],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
    return await queryInstructor;
  } catch (error) {
    throw error;
  }
};
