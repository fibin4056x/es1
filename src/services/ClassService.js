import api from "./api";

/* =========================================
   GET ALL CLASSES
========================================= */

export const getClasses = async () => {
  const res = await api.get("/classes");
  return res.data;
};

/* =========================================
   CREATE CLASS
========================================= */

export const createClass = async (data) => {
  const res = await api.post("/classes", data);
  return res.data;
};

/* =========================================
   GET CLASS
========================================= */

export const getClass = async (id) => {
  const res = await api.get(`/classes/${id}`);
  return res.data;
};

/* =========================================
   UPDATE CLASS
========================================= */

export const updateClass = async (
  id,
  data
) => {
  const res = await api.patch(
    `/classes/${id}`,
    data
  );

  return res.data;
};

/* =========================================
   DELETE CLASS
========================================= */

export const deleteClass = async (
  id
) => {
  const res = await api.delete(
    `/classes/${id}`
  );

  return res.data;
};