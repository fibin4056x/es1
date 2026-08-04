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
export const importStudents = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/import/students", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
