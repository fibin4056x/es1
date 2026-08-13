import api from "./api";

/* =========================================
   MARK ATTENDANCE
========================================= */

export const markAttendance = async (data) => {
  const res = await api.post("/attendance", data);
  return res.data;
};

/* =========================================
   GET ATTENDANCE BY DATE
========================================= */

export const getAttendanceByDate = async (divisionId, date) => {
  const res = await api.get(`/attendance/division/${divisionId}`, {
    params: { date },
  });
  return res.data;
};

/* =========================================
   GET ATTENDANCE CALENDAR SUMMARY
========================================= */

export const getAttendanceCalendar = async (divisionId, month, year) => {
  const res = await api.get(`/attendance/calendar/${divisionId}`, {
    params: { month, year },
  });
  return res.data;
};

/* =========================================
   GET ATTENDANCE HISTORY
========================================= */

export const getAttendanceHistory = async (divisionId, params = {}) => {
  const res = await api.get(`/attendance/history/${divisionId}`, {
    params,
  });
  return res.data;
};

/* =========================================
   UPDATE ATTENDANCE
========================================= */

export const updateAttendance = async (attendanceId, data) => {
  const res = await api.patch(`/attendance/${attendanceId}`, data);
  return res.data;
};

/* =========================================
   UPLOAD ATTENDANCE DOCUMENTS
========================================= */

export const uploadAttendanceDocuments = async (attendanceId, formData) => {
  const res = await api.patch(`/attendance/${attendanceId}/document`, formData);
  return res.data;
};

/* =========================================
   REPLACE ATTENDANCE DOCUMENT
========================================= */

export const replaceAttendanceDocument = async (
  attendanceId,
  documentId,
  formData
) => {
  const res = await api.patch(
    `/attendance/${attendanceId}/document/${documentId}`,
    formData
  );
  return res.data;
};

/* =========================================
   DELETE ATTENDANCE DOCUMENT
========================================= */

export const deleteAttendanceDocument = async (attendanceId, documentId) => {
  const res = await api.delete(
    `/attendance/${attendanceId}/document/${documentId}`
  );
  return res.data;
};

/* =========================================
   DELETE ATTENDANCE
========================================= */

export const deleteAttendance = async (attendanceId) => {
  const res = await api.delete(`/attendance/${attendanceId}`, {
    data: {
      confirmDelete: true,
    },
  });
  return res.data;
};