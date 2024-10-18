const dbCon = require("../../connection");

module.exports = async () => {
  try {
    const queryingCourse = new Promise((resolve, reject) => {
      dbCon.query("SELECT * FROM course", (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    return await queryingCourse;
  } catch (error) {
    throw error;
  }
};
