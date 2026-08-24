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
  const teacherId =
    typeof id === "object"
      ? id?._id || id?.id || id?.user?._id || id?.user?.id
      : id;

  const endpoints = [
    `/teachers/${teacherId}`,
    `/teacher/${teacherId}`,
    `/teachers/profile/${teacherId}`,
    `/auth/teacher/${teacherId}`,
  ];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const res = await api.patch(endpoint, data);
      return res.data;
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404 || status === 405) {
        try {
          const res = await api.put(endpoint, data);
          return res.data;
        } catch (putErr) {
          lastError = putErr;
        }
      } else {
        throw err;
      }
    }
  }

  if (lastError) {
    throw lastError;
  }
  throw new Error("Unable to update teacher profile.");
};

/* =========================================
   DELETE TEACHER
========================================= */

export const deleteTeacher = async (id) => {
  const res = await api.delete(`/teachers/${id}`);
  return res.data;
};