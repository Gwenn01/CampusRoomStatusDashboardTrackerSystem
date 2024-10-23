const dbCon = require("../../connection");

module.exports = async (course_id) => {
  try {
    const queryingCourse = new Promise((resolve, reject) => {
      dbCon.query(
        "SELECT * FROM course WHERE course_id = ?",
        [course_id],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
    return await queryingCourse;
  } catch (error) {
    throw error;
  }
};
