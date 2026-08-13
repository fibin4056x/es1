import api from "./api";

/**
 * Get core dashboard metrics (students count, teachers count, classes count, attendance stats, charts)
 */
export const getDashboardStats = async (params = {}) => {
  const response = await api.get("/dashboard/stats", { params });
  return response.data;
};