const dbCon = require("../../connection");

module.exports = async (scheduleData) => {
  try {
    const {
      course,
      semester,
      stud_year,
      section,
      instructor,
      subject_description,
      time_sched,
      room,
      day_sched,
      instructor_id,
    } = scheduleData;

    const queryInsertSchedule = new Promise((resolve, reject) => {
      const query = `INSERT INTO examschedule(course, semester, stud_year, section, instructor, subject_description, time_sched, room, day_sched, instructor_id) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      // Execute query with array of values to be inserted
      dbCon.query(
        query,
        [
          course,
          semester,
          stud_year,
          section,
          instructor,
          subject_description,
          time_sched,
          room,
          day_sched,
          instructor_id,
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

    const result = await queryInsertSchedule;
    return result;
  } catch (error) {
    throw error;
  }
};
