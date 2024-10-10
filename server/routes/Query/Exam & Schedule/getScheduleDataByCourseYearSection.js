const dbCon = require("../../connection");

module.exports = async (course, year, section) => {
  try {
    const queryByCourseYearSection = new Promise((resolve, reject) => {
      dbCon.query(
        `SELECT * FROM schedule WHERE course = ? AND stud_year = ? AND section = ?`,
        [course, year, section],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
    return await queryByCourseYearSection;
  } catch (error) {
    throw error;
  }
};
