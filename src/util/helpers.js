/**
 * Extracts the student ID string from a studentId field which could be:
 * - A string (ObjectId)
 * - An object containing an _id property (Populated object)
 */
export const getStudentId = (student) => {
  if (!student) return "";
  if (typeof student === "object") {
    return student._id || "";
  }
  return student;
};

/**
 * Compares two student ID values (which may be either strings or populated objects)
 * to determine if they refer to the same student.
 */
export const isSameStudent = (studentA, studentB) => {
  return getStudentId(studentA) === getStudentId(studentB);
};
