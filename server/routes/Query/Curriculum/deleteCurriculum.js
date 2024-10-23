const dbCon = require("../../connection");

module.exports = async (curriculum_id) => {
  try {
    const id = curriculum_id;
    const queryDeleteCurriculum = new Promise((resolve, reject) => {
      dbCon.query(
        "DELETE FROM curriculum WHERE id = ?",
        [id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    const resultDeleteCurriculum = await queryDeleteCurriculum;
    return resultDeleteCurriculum;
  } catch (error) {
    throw error;
  }
};
