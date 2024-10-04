const dbCon = require("../../connection");

module.exports = async (scheduleId, updatedData) => {
  try {
    const updateScheduleQuery = new Promise((resolve, reject) => {
      const values = [
        updatedData.subject_description,
        updatedData.instructor,
        updatedData.time_sched,
        updatedData.room,
        updatedData.day_sched,
        scheduleId,
      ];
      // SQL query to update the schedule
      const queryUpdate = `
              UPDATE examschedule
              SET subject_description = ?, instructor = ?, time_sched = ?, room = ?, day_sched = ?
              WHERE id = ?`;
      dbCon.query(queryUpdate, values, (err, result) => {
        if (err) {
          reject(err);
        }
        // Check if any rows were affected
        if (result.affectedRows === 0) {
          reject({ message: "Schedule not found" });
        }
        resolve({ message: "Schedule updated successfully" });
      });
    });

    const result = await updateScheduleQuery;
    return result;
  } catch (error) {
    throw error;
  }
};
