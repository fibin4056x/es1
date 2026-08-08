import api from "./api";

/**
 * 1. Get School Overall Attendance Report
 * GET /api/reports/attendance/school
 */
export const getSchoolAttendanceReport = async (params = {}) => {
  const response = await api.get("/reports/attendance/school", { params });
  return response.data;
};

/**
 * 2. Get Monthly Attendance Report
 * GET /api/reports/attendance/monthly
 */
export const getMonthlyAttendanceReport = async (params = {}) => {
  const response = await api.get("/reports/attendance/monthly", { params });
  return response.data;
};

/**
 * 3. Get Daily Attendance Report
 * GET /api/reports/attendance/daily
 */
export const getDailyAttendanceReport = async (params = {}) => {
  const response = await api.get("/reports/attendance/daily", { params });
  return response.data;
};

/**
 * 4. Get Class Attendance Report
 * GET /api/reports/attendance/class/:classId
 */
export const getClassAttendanceReport = async (classId, params = {}) => {
  const response = await api.get(`/reports/attendance/class/${classId}`, { params });
  return response.data;
};

/**
 * 5. Get Division Attendance Report
 * GET /api/reports/attendance/division/:divisionId
 */
export const getDivisionAttendanceReport = async (divisionId, params = {}) => {
  const response = await api.get(`/reports/attendance/division/${divisionId}`, { params });
  return response.data;
};

/**
 * 6. Get Student Attendance History Report
 * GET /api/reports/attendance/student/:studentId
 */
export const getStudentAttendanceReport = async (studentId, params = {}) => {
  const response = await api.get(`/reports/attendance/student/${studentId}`, { params });
  return response.data;
};

/**
 * Legacy Fallback Helper
 */
export const getAttendanceReports = async (params = {}) => {
  if (params.divisionId) {
    return getDivisionAttendanceReport(params.divisionId, params);
  }
  if (params.classId) {
    return getClassAttendanceReport(params.classId, params);
  }
  if (params.month && params.month !== "all") {
    return getMonthlyAttendanceReport(params);
  }
  return getSchoolAttendanceReport(params);
};
