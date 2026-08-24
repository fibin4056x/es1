import api from "./api";

/* =========================================
   GET ALL TEACHERS (WITH PAGINATION & FILTERS)
========================================= */

export const getTeachers = async (params = {}) => {
  const res = await api.get("/teachers", { params });
  return res.data;
};

export const getTeacherList = getTeachers;

/* =========================================
   CREATE TEACHER
========================================= */

export const createTeacher = async (data) => {
  const res = await api.post("/teachers", data);
  return res.data;
};

/* =========================================
   GET TEACHER BY ID
========================================= */

export const getTeacher = async (id) => {
  const res = await api.get(`/teachers/${id}`);
  return res.data;
};

/* =========================================
   UPDATE TEACHER STATUS
========================================= */

export const updateTeacherStatus = async (id, status) => {
  const res = await api.patch(`/teachers/${id}/status`, { status });
  return res.data;
};

/* =========================================
   UPDATE TEACHER
========================================= */

export const updateTeacher = async (id, data) => {
  const teacherId = typeof id === "object" ? (id?._id || id?.id) : id;
  try {
    const res = await api.patch(`/teachers/${teacherId}`, data);
    return res.data;
  } catch (err) {
    if (err?.response?.status === 404 || err?.response?.status === 405) {
      const res = await api.put(`/teachers/${teacherId}`, data);
      return res.data;
    }
    throw err;
  }
};

/* =========================================
   DELETE TEACHER
========================================= */

export const deleteTeacher = async (id) => {
  const res = await api.delete(`/teachers/${id}`);
  return res.data;
};