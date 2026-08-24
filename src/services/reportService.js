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
 * 7. Compose & Send Communication Report (FormData)
 * POST /api/reports
 */
export const createReport = async (formData) => {
  const response = await api.post("/reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Get All Reports (Paginated & Filtered)
 * GET /api/reports
 */
export const getReports = async (params = {}) => {
  const response = await api.get("/reports", { params });
  return response.data;
};

/**
 * 8. Get Report Inbox (Paginated & Filtered)
 * GET /api/reports/inbox
 */
export const getInboxReports = async (params = {}) => {
  const response = await api.get("/reports/inbox", { params });
  return response.data;
};

/**
 * 9. Get Sent Reports (Paginated & Filtered)
 * GET /api/reports/sent
 */
export const getSentReports = async (params = {}) => {
  const response = await api.get("/reports/sent", { params });
  return response.data;
};

/**
 * 10. Get Single Report Details (Auto-marks read for recipient)
 * GET /api/reports/:id
 */
export const getReportById = async (id) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

/**
 * 11. Mark Report Read Status
 * PATCH /api/reports/:id/read
 */
export const markReportRead = async (id, isRead = true) => {
  const response = await api.patch(`/reports/${id}/read`, { isRead });
  return response.data;
};

/**
 * 12. Delete Report
 * DELETE /api/reports/:id
 */
export const deleteReport = async (id) => {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
};

/**
 * 13. Update Report
 * PUT or PATCH /api/reports/:id
 */
export const updateReport = async (id, formData) => {
  try {
    const response = await api.put(`/reports/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    if (err?.response?.status === 404 || err?.response?.status === 405) {
      const response = await api.patch(`/reports/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    }
    throw err;
  }
};

/**
 * 14. Delete Single Report Attachment
 * DELETE /api/reports/:id/attachments/:attachmentId
 */
export const deleteReportAttachment = async (reportId, attachmentId) => {
  const endpoints = [
    `/reports/${reportId}/attachments/${attachmentId}`,
    `/reports/${reportId}/attachment/${attachmentId}`,
  ];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (err) {
      lastError = err;
      const status = err?.response?.status;
      if (status === 404 || status === 405) {
        continue;
      }
      throw err;
    }
  }

  // Fallback: If discrete endpoint isn't supported, send PATCH/PUT with deleteAttachmentId
  try {
    const response = await api.patch(`/reports/${reportId}`, { deleteAttachmentId: attachmentId });
    return response.data;
  } catch {
    throw lastError;
  }
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
