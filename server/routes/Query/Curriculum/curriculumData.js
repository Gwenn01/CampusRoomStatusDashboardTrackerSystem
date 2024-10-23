const dbCon = require("../../connection");

module.exports = async (course_id) => {
  try {
    const quryAllCurriculum = new Promise((resolve, reject) => {
      dbCon.query(
        "SELECT * FROM curriculum WHERE course_id = ?",
        [course_id],
        (err, result) => {
          if (err) {
            reject(err);
            res.status(500).json({ error: "Error retrieving curriculum data" });
          } else {
            resolve(result);
          }
        }
      );
    });
    // get the data if is done
    const curriculumData = await quryAllCurriculum;
    return curriculumData;
  } catch (error) {
    throw error;
  }
};
