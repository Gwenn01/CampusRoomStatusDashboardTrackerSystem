const dbCon = require("../../connection");

module.exports = async (year) => {
  try {
    const queryYear = new Promise((resolve, reject) => {
      dbCon.query(
        "SELECT * FROM schedule WHERE stud_year = ?",
        [year],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
    return await queryYear;
  } catch (error) {
    throw error;
  }
};
