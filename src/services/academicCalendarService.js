import api from "./api";

/**
 * Get Academic Calendar events with optional filters & pagination
 */
export const getAcademicCalendarEvents = async (params = {}) => {
  const response = await api.get("/academic-calendar", { params });
  return response.data;
};

/**
 * Get Month View Calendar events
 */
export const getCalendarMonthEvents = async (month, year, params = {}) => {
  const response = await api.get("/academic-calendar/month", {
    params: { month, year, ...params },
  });
  return response.data;
};

/**
 * Get Working Days Summary
 */
export const getWorkingDaysSummary = async (academicYear, params = {}) => {
  const [startYear, endYear] = (academicYear || "2025-2026").split("-");
  const startDate = params.startDate || `${startYear || 2025}-06-01`;
  const endDate = params.endDate || `${endYear || 2026}-05-31`;

  const response = await api.get("/academic-calendar/working-days", {
    params: { startDate, endDate, academicYear, ...params },
  });
  return response.data;
};

/**
 * Get Upcoming Events (Next N days)
 */
export const getUpcomingEvents = async (limit = 10, params = {}) => {
  const response = await api.get("/academic-calendar/upcoming", {
    params: { limit, ...params },
  });
  return response.data;
};

/**
 * Get Single Event Details by ID
 */
export const getAcademicCalendarById = async (id) => {
  const response = await api.get(`/academic-calendar/${id}`);
  return response.data;
};

/**
 * Create New Academic Event (Principal only)
 */
export const createAcademicEvent = async (eventData) => {
  const response = await api.post("/academic-calendar", eventData);
  return response.data;
};

/**
 * Update Academic Event (Principal only)
 */
export const updateAcademicEvent = async (id, eventData) => {
  const response = await api.patch(`/academic-calendar/${id}`, eventData);
  return response.data;
};

/**
 * Soft Delete Academic Event (Principal only)
 */
export const deleteAcademicEvent = async (id) => {
  const response = await api.delete(`/academic-calendar/${id}`);
  return response.data;
};

/**
 * Restore Soft-Deleted Academic Event (Principal only)
 */
export const restoreAcademicEvent = async (id) => {
  const response = await api.patch(`/academic-calendar/${id}/restore`);
  return response.data;
};

/**
 * Get Academic Calendar Reports
 */
export const getAcademicReports = async (params = {}) => {
  const response = await api.get("/academic-calendar/reports", { params });
  return response.data;
};
