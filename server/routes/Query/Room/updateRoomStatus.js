const dbCon = require("../../connection");

module.exports = async (room_id, status, instructorName, timeIn) => {
  try {
    const queryUpdateRoomStatus = new Promise((resolve, reject) => {
      dbCon.query(
        "UPDATE rooms SET roomStatus = ?, instructorName = ?, timeIn = ? WHERE id = ?",
        [status, instructorName, timeIn, room_id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    const result = await queryUpdateRoomStatus;
    return result;
  } catch (error) {
    throw error;
  }
};
