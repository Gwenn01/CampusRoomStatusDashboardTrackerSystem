const dbCon = require("../../connection");

module.exports = async () => {
  try {
    const instructorQuery = new Promise((resolve, reject) => {
      dbCon.query("SELECT * FROM instructor", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const results = await instructorQuery;

    const instructordata = {
      instructor: results,
    };

    return instructordata;
  } catch (err) {
    // Handle errors
    throw err;
  }
};
