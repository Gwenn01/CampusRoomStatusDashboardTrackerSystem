const dbCon = require("../../connection");

module.exports = async () => {
  try {
    const querySchedule = new Promise((resolve, reject) => {
      dbCon.query("SELECT * FROM schedule", (err, result) => {
        if (err) {
          reject(err); // Reject the promise if there's an error
        } else {
          resolve(result); // Resolve the promise if query is successful
        }
      });
    });
    const scheduleData = await querySchedule;
    return scheduleData;
  } catch (error) {
    throw error;
  }
};
