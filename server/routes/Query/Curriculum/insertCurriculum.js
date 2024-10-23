const dbCon = require("../../connection");

module.exports = async (newCurriculumData) => {
  try {
    // Destructure from the object directly
    const { code, name, units, year, semester, course_id } = newCurriculumData;

    const quryInsertCurriculum = new Promise((resolve, reject) => {
      dbCon.query(
        "INSERT INTO curriculum(code, name, units, year, semester, course_id) VALUES (?, ?, ?, ?, ?, ?)",
        [code, name, units, year, semester, course_id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    // Get the result after the query is done
    const curriculumData = await quryInsertCurriculum;
    return curriculumData;
  } catch (error) {
    throw error;
  }
};
