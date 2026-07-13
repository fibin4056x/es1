import api from "./api";

/* =========================================
   GET ALL STUDENTS
========================================= */

export const getStudents = async () => {
  const res = await api.get("/students");
  return res.data;
};

/* =========================================
   CREATE STUDENT
========================================= */

export const createStudent = async (data) => {
  const res = await api.post("/students", data);
  return res.data;
};

/* =========================================
   GET STUDENT BY ID
========================================= */

export const getStudent = async (id) => {
  const res = await api.get(`/students/${id}`);
  return res.data;
};

/* =========================================
   UPDATE STUDENT
========================================= */

export const updateStudent = async (id, data) => {
  const res = await api.patch(`/students/${id}`, data);
  return res.data;
};

/* =========================================
   DELETE STUDENT
========================================= */

export const deleteStudent = async (id) => {
  const res = await api.delete(`/students/${id}`);
  return res.data;
};

/* =========================================
   GET STUDENTS BY DIVISION
========================================= */

export const getStudentsByDivision = async (
  divisionId
) => {
  const res = await api.get(
    `/students/division/${divisionId}`
  );

  return res.data;
};