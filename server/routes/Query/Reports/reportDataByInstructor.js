const dbCon = require("../../connection");

module.exports = async (id) => {
  try {
    const instructor_id = id;
    const queryingReportData = new Promise((resolve, reject) => {
      dbCon.query(
        `SELECT * FROM reports WHERE instructor_id = ?`,
        [instructor_id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    return await queryingReportData;
  } catch (error) {
    throw error;
  }
};
