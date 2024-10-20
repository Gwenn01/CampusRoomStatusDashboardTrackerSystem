const dbCon = require("../../connection");

module.exports = async (scheduleID) => {
  try {
    const querySchedID = new Promise((resolve, reject) => {
      const id = scheduleID;
      const querySchedule = `SELECT * FROM schedule WHERE id = ?`;
      dbCon.query(querySchedule, [id], (err, result) => {
        if (err) {
          reject(err);
        } else if (result.length === 0) {
          reject({ message: "Schedule not found" });
        } else {
          resolve(result);
        }
      });
    });
    return await querySchedID;
  } catch (error) {
    throw error;
  }
};
