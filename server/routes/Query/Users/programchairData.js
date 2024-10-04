const dbCon = require("../../connection");

module.exports = async () => {
  try {
    const programChairQuery = new Promise((resolve, reject) => {
      dbCon.query("SELECT * FROM programchair", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const results = await programChairQuery;
    // Return both instructor and program chair data
    const programchairdata = {
      programchair: results,
    };

    return programchairdata;
  } catch (err) {
    // Handle errors
    throw err;
  }
};
