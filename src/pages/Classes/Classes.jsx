/* eslint-disable */
import { useEffect, useState, useCallback } from "react";
import { getClasses } from "../../services/ClassService";
import ClassTable from "./ClassTable";
import ClassModal from "./ClassModal";
import EditClassModal from "./EditClassModal";
import Pagination from "../../components/common/pagination/Pagination";
import Loader from "../../components/common/Loader/Loader";
import { getApiErrorMessage } from "../../services/api";

import "./Classes.css";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 5;

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getClasses();
      const list = res.data?.classes || res.classes || res.data || [];
      setClasses(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error loading classes:", err);
      setError(getApiErrorMessage(err, "Failed to load class records."));
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const filteredClasses = classes.filter(
    (singleClass) =>
      (singleClass.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (singleClass.academicYear || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const lastClassIndex = currentPage * classesPerPage;
  const firstClassIndex = lastClassIndex - classesPerPage;
  const currentClasses = filteredClasses.slice(firstClassIndex, lastClassIndex);
  const totalPages = Math.ceil(filteredClasses.length / classesPerPage) || 1;

  const totalClasses = classes.length;
  const activeClasses = classes.filter((c) => (c.status || "active").toLowerCase() === "active").length;
  const academicYears = new Set(classes.map((c) => c.academicYear).filter(Boolean)).size;
  const inactiveClasses = classes.filter((c) => (c.status || "").toLowerCase() === "inactive" || (c.status || "").toLowerCase() === "archived").length;

  return (
    <div className="classes-page animate-fade-in-up">
      {/* Classes Page Header */}
      <div className="classes-header-row">
        <div className="classes-title-group">
          <h1>Classes</h1>
          <p>Manage classes, academic years, assignments, and status.</p>
        </div>
        <div>
          <button type="button" className="classes-add-btn btn-press" onClick={() => setOpen(true)}>
            <span className="material-symbols-outlined">add</span>
            Add Class
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="classes-toolbar">
        <div className="classes-search-wrapper">
          <span className="material-symbols-outlined">search</span>
          <input
            type="search"
            className="classes-search-input"
            placeholder="Search class name or academic year..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="classes-stats-grid">
        <div className="class-stat-card primary">
          <div className="class-stat-glow" />
          <div className="class-stat-top-row">
            <div className="class-stat-header primary">
              <span className="material-symbols-outlined">class</span>
              Total Classes
            </div>
          </div>
          <div className="class-stat-value">{totalClasses}</div>
        </div>

        <div className="class-stat-card success">
          <div className="class-stat-glow" />
          <div className="class-stat-top-row">
            <div className="class-stat-header success">
              <span className="material-symbols-outlined">verified</span>
              Active Classes
            </div>
            <div className="class-stat-badge success">
              Active Term
            </div>
          </div>
          <div className="class-stat-value">{activeClasses}</div>
        </div>

        <div className="class-stat-card info">
          <div className="class-stat-glow" />
          <div className="class-stat-top-row">
            <div className="class-stat-header info">
              <span className="material-symbols-outlined">calendar_today</span>
              Academic Years
            </div>
          </div>
          <div className="class-stat-value">{academicYears}</div>
        </div>

        <div className="class-stat-card danger">
          <div className="class-stat-glow" />
          <div className="class-stat-top-row">
            <div className="class-stat-header danger">
              <span className="material-symbols-outlined">archive</span>
              Inactive / Archived
            </div>
          </div>
          <div className="class-stat-value">{inactiveClasses}</div>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", padding: "16px", borderRadius: "8px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{error}</span>
          <button type="button" onClick={loadClasses} style={{ background: "rgba(239, 68, 68, 0.3)", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="loading-state" style={{ padding: "60px 0", textAlign: "center" }}>
          <Loader size="medium" text="Loading classes..." />
        </div>
      ) : (
        <>
          <div className="glass-card table-card">
            <div className="table-responsive">
              <ClassTable
                classes={currentClasses}
                reload={loadClasses}
                onEdit={(singleClass) => {
                  setSelectedClass(singleClass);
                  setEditOpen(true);
                }}
              />
            </div>
          </div>

          {filteredClasses.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      <ClassModal
        open={open}
        onClose={() => setOpen(false)}
        reload={loadClasses}
      />

      <EditClassModal
        open={editOpen}
        classData={selectedClass}
        onClose={() => {
          setEditOpen(false);
          setSelectedClass(null);
        }}
        reload={loadClasses}
      />
    </div>
  );
}

export default Classes;