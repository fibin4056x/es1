import api from "./api";

/**
 * Helper utility to handle file downloads using Blobs.
 * Extracts the filename from the Content-Disposition header if available.
 */
export const downloadFile = (response, fallbackFilename) => {
  let filename = fallbackFilename;
  const contentDisposition =
    response.headers?.["content-disposition"] ||
    response.headers?.["Content-Disposition"];

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

  const blob = new Blob([response.data], {
    type: response.headers?.["content-type"] || "application/octet-stream",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * 1. Export All Students (CSV or Excel)
 */
export const exportAllStudents = async (format = "csv") => {
  const response = await api.get("/export/students", {
    params: { format },
    responseType: "blob",
  });
  downloadFile(response, `students.${format === "xlsx" ? "xlsx" : "csv"}`);
  return response;
};

/**
 * 2. Export Students by Class
 */
export const exportStudentsByClass = async (classId, format = "csv") => {
  const response = await api.get(`/export/students/class/${classId}`, {
    params: { format },
    responseType: "blob",
  });
  downloadFile(response, `students-class.${format === "xlsx" ? "xlsx" : "csv"}`);
  return response;
};

/**
 * 3. Export Students by Division
 */
export const exportStudentsByDivision = async (divisionId, format = "csv") => {
  const response = await api.get(`/export/students/division/${divisionId}`, {
    params: { format },
    responseType: "blob",
  });
  downloadFile(response, `students-division.${format === "xlsx" ? "xlsx" : "csv"}`);
  return response;
};

/**
 * 4. Export Students by Teacher
 */
export const exportStudentsByTeacher = async (teacherId, format = "csv") => {
  const response = await api.get(`/export/students/teacher/${teacherId}`, {
    params: { format },
    responseType: "blob",
  });
  downloadFile(response, `students-teacher.${format === "xlsx" ? "xlsx" : "csv"}`);
  return response;
};
