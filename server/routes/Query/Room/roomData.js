const dbCon = require("../../connection");

module.exports = async () => {
  try {
    const queryGetRoom = new Promise((resolve, reject) => {
      dbCon.query("SELECT * FROM rooms", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const result = await queryGetRoom;
    return result;
  } catch (error) {
    throw error;
  }
};
