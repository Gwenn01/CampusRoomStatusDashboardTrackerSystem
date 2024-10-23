const dbCon = require("../../connection");

module.exports = async (curriculum_id, updatedCurriculumData) => {
  try {
    const id = curriculum_id;
    const { code, name, units, year, semester } = updatedCurriculumData;
    const queryUpdateCurriculum = new Promise((resolve, reject) => {
      dbCon.query(
        `UPDATE curriculum SET code = ?, name = ?, units = ?, year = ?, semester = ? WHERE id = ?`,
        [code, name, units, year, semester, id],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
    const updateResult = await queryUpdateCurriculum;
    return updateResult;
  } catch (error) {
    throw error;
  }
};
