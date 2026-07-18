import api from "./api";

/* =========================================
   MARK ATTENDANCE
========================================= */

export const markAttendance = (data) =>
  api.post("/attendance", data);

/* =========================================
   GET ATTENDANCE BY DATE
========================================= */

export const getAttendanceByDate = (
  divisionId,
  date
) =>
  api.get(
    `/attendance/division/${divisionId}?date=${date}`
  );

/* =========================================
   GET ATTENDANCE HISTORY
========================================= */

export const getAttendanceHistory = (
  divisionId
) =>
  api.get(
    `/attendance/history/${divisionId}`
  );
  /* =========================================
   SAVE ATTENDANCE
========================================= */

export const saveAttendance = (data) =>
  api.post("/attendance", data);