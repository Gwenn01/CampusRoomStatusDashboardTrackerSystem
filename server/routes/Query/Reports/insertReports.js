const dbCon = require("../../connection");

module.exports = async (
  room_name,
  instructor_name,
  time_in,
  time_out,
  instructor_id,
  date_reports
) => {
  try {
    const time = calculateTimeCount(time_in, time_out);
    const time_count = time.hours + ":" + time.minutes + ":" + time.seconds;
    const queryInsertReportData = new Promise((resolve, reject) => {
      dbCon.query(
        `INSERT INTO reports (room_name, instructor_name, time_in, time_out, time_count, instructor_id, date_reports) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          room_name,
          instructor_name,
          time_in,
          time_out,
          time_count,
          instructor_id,
          date_reports,
        ],
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
    });
    return await queryInsertReportData;
  } catch (error) {
    throw error;
  }

  function calculateTimeCount(timeIn, timeOut) {
    // Function to convert time string to total seconds
    function timeToSeconds(timeStr) {
      const [timePart, modifier] = timeStr.split(" ");
      let [hours, minutes, seconds] = timePart.split(":").map(Number);

      // Convert hours to 24-hour format
      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }
      if (modifier === "AM" && hours === 12) {
        hours = 0; // Midnight case
      }

      // Convert everything to seconds
      return hours * 3600 + minutes * 60 + seconds;
    }

    // Convert time strings to total seconds
    const timeInSeconds = timeToSeconds(timeIn);
    const timeOutSeconds = timeToSeconds(timeOut);

    // Calculate the difference (handle crossing over midnight)
    let timeDifference = timeOutSeconds - timeInSeconds;
    if (timeDifference < 0) {
      timeDifference += 24 * 3600; // Add 24 hours worth of seconds if crossing midnight
    }

    // Convert time difference back to hours, minutes, and seconds
    const hours = Math.floor(timeDifference / 3600);
    const minutes = Math.floor((timeDifference % 3600) / 60);
    const seconds = timeDifference % 60;

    return { hours, minutes, seconds };
  }
};
