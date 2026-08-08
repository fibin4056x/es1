import api from "./api";

export const getTeachers = async () => {
  const res = await api.get("/teachers");
  return res.data;
};

export const getTeacherList = getTeachers;

export const createTeacher = async (data) => {
  const res = await api.post("/teachers", data);
  return res.data;
};

export const getTeacher = async (id) => {
  const res = await api.get(`/teachers/${id}`);
  return res.data;
};

export const updateTeacherStatus = async (id, status) => {
  const res = await api.patch(`/teachers/${id}/status`, {
    status,
  });

  return res.data;
};
export const updateTeacher = async (id, data) => {
  const res = await api.patch(`/teachers/${id}`, data);
  return res.data;
};


export const deleteTeacher = async (id) => {
  const res = await api.delete(`/teachers/${id}`);
  return res.data;
};