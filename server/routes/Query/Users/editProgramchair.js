const dbCon = require("../../connection");

module.exports = async (id, toBeEditValue) => {
  try {
    const {
      instructorId,
      instructorName,
      instructorUsername,
      instructorPassword,
    } = toBeEditValue;

    const quryEditProgramchair = new Promise((resolve, reject) => {
      dbCon.query(
        `UPDATE programchair SET programchair_id = ?, programchair_name = ?, programchair_username = ?, programchair_password = ? WHERE programchair_id = ?`,
        [
          instructorId,
          instructorName,
          instructorUsername,
          instructorPassword,
          id,
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    const result = await quryEditProgramchair;
    return result;
  } catch (error) {
    throw error;
  }
};
