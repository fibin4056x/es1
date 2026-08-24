import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Formats date into readable string
 */
const formatDate = (dateVal) => {
  if (!dateVal) return "N/A";
  try {
    return new Date(dateVal).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(dateVal);
  }
};

/**
 * Export reports list to PDF document with autoTable
 */
export const exportReportsListPDF = (reportsList = [], searchFilter = "") => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const primaryColor = [79, 70, 229]; // Indigo #4f46e5

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 297, 24, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("EduTrack SLMS • School Reports Overview", 14, 15);

  // Sub-header metadata
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const generatedAt = new Date().toLocaleString();
  doc.text(`Generated: ${generatedAt}`, 283, 15, { align: "right" });

  // Filter Information
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Report Parameters:", 14, 32);

  doc.setFont("helvetica", "normal");
  const filterText = searchFilter ? `Search Query: "${searchFilter}"` : "Filter: All Reports";
  doc.text(`${filterText} | Total Records: ${reportsList.length}`, 14, 38);

  // Table Columns & Rows
  const head = [["#", "Student Name", "Report Subject / Title", "Submitted By", "Date", "Attachments"]];

  const body = reportsList.map((r, index) => {
    const studentName = r.studentId?.nameEnglish || r.studentId?.name || "Student";
    const subject = r.subject || r.title || "No Subject";
    const submittedBy =
      r.senderId?.name ||
      r.senderId?.fullName ||
      r.creatorId?.name ||
      r.creatorId?.fullName ||
      r.submittedBy?.name ||
      r.submittedBy ||
      "Staff";
    const dateStr = formatDate(r.createdAt);
    const attCount = Array.isArray(r.attachments) && r.attachments.length > 0 ? `${r.attachments.length} File(s)` : "None";

    return [index + 1, studentName, subject, submittedBy, dateStr, attCount];
  });

  // Render Table
  autoTable(doc, {
    startY: 44,
    head: head,
    body: body,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: 55 },
      2: { cellWidth: 110 },
      3: { cellWidth: 50 },
      4: { cellWidth: 30, halign: "center" },
      5: { cellWidth: 26, halign: "center" },
    },
    didDrawPage: (data) => {
      // Footer page number
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        283,
        202,
        { align: "right" }
      );
      doc.text(
        "EduTrack Enterprise SLMS — Confidential School Report",
        14,
        202
      );
    },
  });

  // Download PDF
  const filename = `SLMS_School_Reports_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
};

/**
 * Export single report detail to PDF document
 */
export const exportReportDetailPDF = (report) => {
  if (!report) return;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const primaryColor = [79, 70, 229];

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("EduTrack SLMS • Communication Report", 14, 18);

  // Metadata Card Block
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 34, 182, 38, 3, 3, "FD");

  const studentName = report.studentId?.nameEnglish || report.studentId?.name || "Student";
  const admNum = report.studentId?.admissionNumber || "N/A";
  const dateStr = formatDate(report.createdAt);
  const submittedBy =
    report.senderId?.name ||
    report.senderId?.fullName ||
    report.creatorId?.name ||
    report.creatorId?.fullName ||
    report.submittedBy?.name ||
    report.submittedBy ||
    "Staff";
  const roleStr = report.senderId?.role || report.creatorId?.role || "Staff";
  const statusStr = report.isRead ? "Read" : "Unread";

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  doc.text(`Student:`, 20, 43);
  doc.setFont("helvetica", "normal");
  doc.text(`${studentName} (Adm No: ${admNum})`, 48, 43);

  doc.setFont("helvetica", "bold");
  doc.text(`Submitted By:`, 20, 51);
  doc.setFont("helvetica", "normal");
  doc.text(`${submittedBy} (${roleStr})`, 48, 51);

  doc.setFont("helvetica", "bold");
  doc.text(`Date & Time:`, 20, 59);
  doc.setFont("helvetica", "normal");
  doc.text(`${dateStr} | Status: ${statusStr}`, 48, 59);

  // Subject Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Subject / Title:", 14, 80);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const splitTitle = doc.splitTextToSize(report.subject || report.title || "No Subject", 182);
  doc.text(splitTitle, 14, 87);

  const titleHeight = splitTitle.length * 6;
  const bodyStartY = 87 + titleHeight + 6;

  // Body Content Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Report Details:", 14, bodyStartY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  const bodyText = report.body || "No additional text details provided.";
  const splitBody = doc.splitTextToSize(bodyText, 182);
  doc.text(splitBody, 14, bodyStartY + 7);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount}`, 196, 287, { align: "right" });
    doc.text("EduTrack Enterprise SLMS — Confidential Academic Report", 14, 287);
  }

  const cleanSubject = (report.subject || "Report").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
  doc.save(`SLMS_Report_${cleanSubject}_${new Date().toISOString().split("T")[0]}.pdf`);
};
