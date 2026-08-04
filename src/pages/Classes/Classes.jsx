/* eslint-disable */
import { useEffect, useState } from "react";

import { getClasses } from "../../services/ClassService";

import ClassTable from "./ClassTable";
import ClassModal from "./ClassModal";
import EditClassModal from "./EditClassModal";
import Pagination from "../../components/common/pagination/Pagination";

import "./Classes.css";

function Classes() {
  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const classesPerPage = 5;

  const [open, setOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);

  const loadClasses = async () => {
    try {
      setLoading(true);

      const res = await getClasses();

      setClasses(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const filteredClasses = classes.filter(
    (singleClass) =>
      (singleClass.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (singleClass.academicYear || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const lastClassIndex =
    currentPage * classesPerPage;

  const firstClassIndex =
    lastClassIndex - classesPerPage;

  const currentClasses =
    filteredClasses.slice(
      firstClassIndex,
      lastClassIndex
    );

  const totalPages = Math.ceil(
    filteredClasses.length /
      classesPerPage
  );

  const totalClasses = classes.length;
  const activeClasses = classes.filter((c) => (c.status || "active") === "active").length;
  const academicYears = new Set(classes.map((c) => c.academicYear).filter(Boolean)).size;
  const inactiveClasses = classes.filter((c) => c.status === "inactive" || c.status === "archived").length;

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
            <div className="class-stat-trend up">
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>trending_up</span>
              +8.4%
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
            <div className="class-stat-badge neutral">
              Current Year
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
            <div className="class-stat-badge neutral">
              Archived
            </div>
          </div>
          <div className="class-stat-value">{inactiveClasses}</div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading classes...</p>
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
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