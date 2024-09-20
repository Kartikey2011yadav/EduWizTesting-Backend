const Teacher = require("../Models/Teacher");

const removeExpiredSessions = async () => {
  try {
    const teachers = await Teacher.find({
      "sessions.expiresAt": { $lt: new Date() },
    });

    for (const teacher of teachers) {
      teacher.sessions = teacher.sessions.filter(
        (session) => new Date(session.expiresAt) > new Date()
      );
      await teacher.save();
    }
  } catch (error) {
    console.error("Error while removing expired sessions:", error);
  }
};

module.exports = { removeExpiredSessions };
