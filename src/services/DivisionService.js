import api from "./api";

/* =========================================
   GET ALL DIVISIONS
========================================= */

export const getDivisions = async () => {
  const res = await api.get("/divisions");
  return res.data;
};

/* =========================================
   CREATE DIVISION
========================================= */

export const createDivision = async (data) => {
  const res = await api.post(
    "/divisions",
    data
  );

  return res.data;
};

/* =========================================
   GET DIVISION
========================================= */

export const getDivision = async (id) => {
  const res = await api.get(
    `/divisions/${id}`
  );

  return res.data;
};

/* =========================================
   UPDATE DIVISION
========================================= */

export const updateDivision = async (
  id,
  data
) => {
  const res = await api.patch(
    `/divisions/${id}`,
    data
  );

  return res.data;
};

/* =========================================
   DELETE DIVISION
========================================= */

export const deleteDivision = async (
  id
) => {
  const res = await api.delete(
    `/divisions/${id}`
  );

  return res.data;
};