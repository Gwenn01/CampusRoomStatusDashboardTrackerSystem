const dbCon = require("../../connection");

module.exports = async () => {
  try {
    const queryReports = new Promise((resolve, reject) => {
      dbCon.query("SELECT * FROM reports", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    const result = await queryReports;
    return result;
  } catch (error) {
    throw error;
  }
};
