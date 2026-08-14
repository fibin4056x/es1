import api from "./api";
import { downloadFile } from "./exportService";

/**
 * Download sample student import template (CSV or Excel)
 */
export const downloadImportTemplate = async (format = "csv") => {
  const response = await api.get("/import/students/template", {
    params: { format },
    responseType: "blob",
  });
  downloadFile(response, `student-import-template.${format === "xlsx" ? "xlsx" : "csv"}`);
  return response;
};

/**
 * Bulk import students via file upload (.csv, .xlsx, .xls)
 */
export const importStudents = async (file, defaultClassId = "", defaultDivisionId = "") => {
  const formData = new FormData();
  formData.append("file", file);
  if (defaultClassId) {
    formData.append("classId", defaultClassId);
    formData.append("defaultClassId", defaultClassId);
  }
  if (defaultDivisionId) {
    formData.append("divisionId", defaultDivisionId);
    formData.append("defaultDivisionId", defaultDivisionId);
  }

  const response = await api.post("/import/students", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
