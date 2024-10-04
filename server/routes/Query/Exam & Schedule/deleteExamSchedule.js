const dbCon = require("../../connection");

module.exports = async (scheduleId) => {
  try {
    const queryDeleteSchedule = new Promise((resolve, reject) => {
      dbCon.query(
        "DELETE FROM examschedule WHERE id = ?",
        [scheduleId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    const result = await queryDeleteSchedule;
    return result;
  } catch (error) {
    throw error;
  }
};
