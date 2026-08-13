import api from "./api";

/* =========================================
   GET ALL DIVISIONS (WITH PAGINATION & SEARCH)
========================================= */

export const getDivisions = async (params = {}) => {
  const res = await api.get("/divisions", { params });
  return res.data;
};

export const getDivisionList = getDivisions;

/* =========================================
   CREATE DIVISION
========================================= */

export const createDivision = async (data) => {
  const res = await api.post("/divisions", data);
  return res.data;
};

/* =========================================
   GET DIVISION
========================================= */

export const getDivision = async (id) => {
  const res = await api.get(`/divisions/${id}`);
  return res.data;
};

/* =========================================
   UPDATE DIVISION
========================================= */

export const updateDivision = async (id, data) => {
  const res = await api.patch(`/divisions/${id}`, data);
  return res.data;
};

/* =========================================
   DELETE DIVISION
========================================= */

export const deleteDivision = async (id) => {
  const res = await api.delete(`/divisions/${id}`);
  return res.data;
};