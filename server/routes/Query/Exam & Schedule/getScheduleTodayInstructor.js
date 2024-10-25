const dbCon = require("../../connection");

module.exports = async (instructor, today) => {
  try {
    const queryingTodayInstructor = new Promise((resolve, reject) => {
      const instructor_id = instructor;
      const day_sched = today;
      dbCon.query(
        `SELECT * FROM schedule WHERE instructor_id = ? AND day_sched = ?`,
        [instructor_id, day_sched],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    return await queryingTodayInstructor;
  } catch (error) {
    throw error;
  }
};
