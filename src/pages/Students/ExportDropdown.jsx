import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  exportAllStudents,
  exportStudentsByClass,
  exportStudentsByDivision,
  exportStudentsByTeacher,
} from "../../services/exportService";
import { getClasses } from "../../services/ClassService";
import { getDivisions } from "../../services/DivisionService";
import { getTeachers } from "../../services/TeacherService";

function ExportDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter modal states
  const [filterType, setFilterType] = useState(null); // 'class' | 'division' | 'teacher' | null
  const [options, setOptions] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [format, setFormat] = useState("csv");
  const [fetchingOptions, setFetchingOptions] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Export All
  const handleExportAll = async (exportFormat) => {
    setIsOpen(false);
    setLoading(true);
    try {
      await exportAllStudents(exportFormat);
      toast.success(`Exported all students (${exportFormat.toUpperCase()}) successfully!`);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to export students.");
    } finally {
      setLoading(false);
    }
  };

  // Open filter selection modal
  const handleOpenFilterModal = async (type) => {
    setIsOpen(false);
    setFilterType(type);
    setSelectedId("");
    setFormat("csv");
    setFetchingOptions(true);

    try {
      if (type === "class") {
        const res = await getClasses();
        setOptions(res.data || []);
      } else if (type === "division") {
        const res = await getDivisions();
        setOptions(res.data || []);
      } else if (type === "teacher") {
        const res = await getTeachers();
        setOptions(res.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to load ${type} options.`);
      setFilterType(null);
    } finally {
      setFetchingOptions(false);
    }
  };

  // Handle Filtered Export Submit
  const handleFilteredExport = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      toast.warning(`Please select a ${filterType}.`);
      return;
    }

    setLoading(true);
    try {
      if (filterType === "class") {
        await exportStudentsByClass(selectedId, format);
      } else if (filterType === "division") {
        await exportStudentsByDivision(selectedId, format);
      } else if (filterType === "teacher") {
        await exportStudentsByTeacher(selectedId, format);
      }
      toast.success(`Exported students by ${filterType} (${format.toUpperCase()}) successfully!`);
      setFilterType(null);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || `Failed to export students by ${filterType}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-dropdown-container" ref={dropdownRef} style={{ position: "relative" }}>
      {/* Export Main Button */}
      <button
        type="button"
        className="export-main-btn btn-press"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={loading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          borderRadius: "8px",
          background: "var(--surface-light, #1e293b)",
          color: "var(--text-main, #f8fafc)",
          border: "1px solid var(--border-main, rgba(255, 255, 255, 0.12))",
          fontWeight: 600,
          fontSize: "14px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "all 0.2s ease",
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
          {loading ? "progress_activity" : "download"}
        </span>
        {loading ? "Exporting..." : "Export"}
        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
          expand_more
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="export-menu-card glass-card"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: "230px",
            background: "var(--surface, #1e1e24)",
            border: "1px solid var(--border-main, rgba(255, 255, 255, 0.12))",
            borderRadius: "12px",
            padding: "8px 0",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            zIndex: 100,
          }}
        >
          <div style={{ padding: "6px 16px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted, #94a3b8)" }}>
            Quick Export
          </div>
          <button
            type="button"
            className="export-item-btn"
            onClick={() => handleExportAll("csv")}
            disabled={loading}
            style={dropdownItemStyle}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#10b981" }}>csv</span>
            All Students (CSV)
          </button>

          <button
            type="button"
            className="export-item-btn"
            onClick={() => handleExportAll("xlsx")}
            disabled={loading}
            style={dropdownItemStyle}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#3b82f6" }}>table_chart</span>
            All Students (Excel)
          </button>

          <div style={{ margin: "6px 0", borderTop: "1px solid var(--border-main, rgba(255, 255, 255, 0.08))" }} />

          <div style={{ padding: "6px 16px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted, #94a3b8)" }}>
            Filtered Export
          </div>
          <button
            type="button"
            className="export-item-btn"
            onClick={() => handleOpenFilterModal("class")}
            disabled={loading}
            style={dropdownItemStyle}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#8b5cf6" }}>school</span>
            Export by Class
          </button>

          <button
            type="button"
            className="export-item-btn"
            onClick={() => handleOpenFilterModal("division")}
            disabled={loading}
            style={dropdownItemStyle}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#f59e0b" }}>groups</span>
            Export by Division
          </button>

          <button
            type="button"
            className="export-item-btn"
            onClick={() => handleOpenFilterModal("teacher")}
            disabled={loading}
            style={dropdownItemStyle}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#ec4899" }}>person</span>
            Export by Teacher
          </button>
        </div>
      )}

      {/* Filter Dialog / Modal */}
      {filterType && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "var(--surface, #18181b)",
              border: "1px solid var(--border-main, rgba(255, 255, 255, 0.12))",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 700, color: "var(--text-main, #f8fafc)" }}>
              Export Students by {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </h3>

            {fetchingOptions ? (
              <p style={{ color: "var(--text-muted, #94a3b8)" }}>Loading options...</p>
            ) : (
              <form onSubmit={handleFilteredExport} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 600, color: "var(--text-secondary, #cbd5e1)" }}>
                    Select {filterType.charAt(0).toUpperCase() + filterType.slice(1)}:
                  </label>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "var(--surface-light, #27272a)",
                      border: "1px solid var(--border-main, rgba(255,255,255,0.12))",
                      color: "var(--text-main, #f8fafc)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  >
                    <option value="">-- Choose --</option>
                    {options.map((item) => (
                      <option key={item._id} value={item._id}>
                        {filterType === "class"
                          ? item.name || `Class ${item.grade || ""}`
                          : filterType === "division"
                          ? item.name || item.divisionName
                          : item.name || item.nameEnglish || item.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 600, color: "var(--text-secondary, #cbd5e1)" }}>
                    Export Format:
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "var(--surface-light, #27272a)",
                      border: "1px solid var(--border-main, rgba(255,255,255,0.12))",
                      color: "var(--text-main, #f8fafc)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  >
                    <option value="csv">CSV (.csv)</option>
                    <option value="xlsx">Excel (.xlsx)</option>
                  </select>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setFilterType(null)}
                    disabled={loading}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: "transparent",
                      color: "var(--text-secondary, #cbd5e1)",
                      border: "1px solid var(--border-main, rgba(255,255,255,0.12))",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "8px",
                      background: "#3b82f6",
                      color: "#ffffff",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? "Exporting..." : "Download Export"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const dropdownItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  padding: "10px 16px",
  background: "transparent",
  border: "none",
  color: "var(--text-main, #f8fafc)",
  fontSize: "14px",
  textAlign: "left",
  cursor: "pointer",
  transition: "background 0.2s ease",
};

export default ExportDropdown;
