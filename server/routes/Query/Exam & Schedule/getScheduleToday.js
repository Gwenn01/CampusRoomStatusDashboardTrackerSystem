const dbCon = require("../../connection");

module.exports = async (today) => {
  try {
    const day_sched = today;
    const queryTodaySched = new Promise((resolve, reject) => {
      dbCon.query(
        "SELECT * FROM schedule WHERE day_sched = ?",
        [day_sched],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
    return await queryTodaySched;
  } catch (error) {
    throw error;
  }
};
