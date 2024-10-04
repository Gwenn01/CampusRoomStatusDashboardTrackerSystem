const dbCon = require("../../connection");

module.exports = async (scheduleID) => {
  try {
    const editScheduleData = new Promise((resolve, reject) => {
      const IDtobeEdited = scheduleID;
      // SQL query to fetch the schedule by ID
      const querySchedule = `SELECT * FROM examschedule WHERE id = ?`;

      dbCon.query(querySchedule, [IDtobeEdited], (err, result) => {
        if (err) {
          reject(err);
        }
        if (result.length === 0) {
          reject({ message: "Schedule not found" });
        }
        resolve(result[0]);
      });
    });
    const scheduleToBeEdited = await editScheduleData;
    return scheduleToBeEdited;
  } catch (error) {
    throw error;
  }
};
