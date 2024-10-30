const dbCon = require("../../connection");

module.exports = async (course, year, section, today) => {
  try {
    const queryByCourseYearSection = new Promise((resolve, reject) => {
      const day_sched = today;
      dbCon.query(
        `SELECT * FROM schedule WHERE course = ? AND stud_year = ? AND section = ? AND day_sched = ?`,
        [course, year, section, day_sched],
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
