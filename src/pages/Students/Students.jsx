/* eslint-disable */
import { useEffect, useState, useCallback } from "react";
import { getStudents } from "../../services/StudentService";
import { getClassList } from "../../services/ClassService";
import { getDivisionList } from "../../services/DivisionService";
import StudentTable from "./StudentTable";
import StudentModal from "./StudentModal";
import EditStudentModal from "./EditStudentModal";
import Pagination from "../../components/common/pagination/Pagination";
import StudentStats from "./StudentStats";
import ExportDropdown from "./ExportDropdown";
import ImportModal from "./ImportModal";

import "./Students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [status, setStatus] = useState("active");

  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);

  // Pagination metadata from backend
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Load dropdown options
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [clsRes, divRes] = await Promise.all([
          getClassList().catch(() => ({ data: [] })),
          getDivisionList().catch(() => ({ data: [] })),
        ]);
        setClasses(clsRes.data || clsRes || []);
        setDivisions(divRes.data || divRes || []);
      } catch (err) {
        console.error("Failed to load class/division options:", err);
      }
    };
    loadDropdowns();
  }, []);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch server-side students list with pagination & filters
  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: debouncedSearch.trim() || undefined,
        classId: classId || undefined,
        divisionId: divisionId || undefined,
        status: status || undefined,
      };

      const res = await getStudents(params);
      const list = res.data?.students || res.students || res.data || [];
      const pagination = res.pagination || res.data?.pagination || {};

      setStudents(list);
      setTotalPages(pagination.totalPages || 1);
      setTotalRecords(pagination.totalRecords || list.length);
    } catch (error) {
      console.log("Failed to load students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, classId, divisionId, status]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  return (
    <div className="students-page animate-fade-in-up">
      {/* Students Page Header */}
      <div className="students-header-row">
        <div className="students-title-group">
          <h1>Students</h1>
          <p>Manage student profiles, academic records, and status.</p>
        </div>
        <div className="students-header-actions" style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn-press"
            onClick={() => setImportOpen(true)}
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
              cursor: "pointer",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>upload</span>
            Import
          </button>
          <ExportDropdown />
          <button type="button" className="students-add-btn btn-press" onClick={() => setOpen(true)}>
            <span className="material-symbols-outlined">add</span>
            Add Student
          </button>
        </div>
      </div>

      {/* Search Toolbar & Filter Controls */}
      <div className="students-toolbar" style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div className="students-search-wrapper" style={{ flex: 1, minWidth: "260px" }}>
          <span className="material-symbols-outlined">search</span>
          <input
            type="search"
            className="students-search-input"
            placeholder="Search by name or admission number..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Class Filter */}
        <select
          style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.6)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.15)", fontSize: "0.875rem" }}
          value={classId}
          onChange={(e) => {
            setClassId(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>{cls.name}</option>
          ))}
        </select>

        {/* Division Filter */}
        <select
          style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.6)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.15)", fontSize: "0.875rem" }}
          value={divisionId}
          onChange={(e) => {
            setDivisionId(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Divisions</option>
          {divisions.map((div) => (
            <option key={div._id} value={div._id}>{div.name}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.6)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.15)", fontSize: "0.875rem" }}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="">All Statuses</option>
        </select>
      </div>

      <StudentStats students={students} />

      {loading ? (
        <div className="loading-state" style={{ padding: "40px 0", textAlign: "center" }}>
          <p>Loading students from server...</p>
        </div>
      ) : (
        <>
          <div className="glass-card table-card">
            <div className="table-responsive">
              <StudentTable
                students={students}
                reload={loadStudents}
                onEdit={(student) => {
                  setSelectedStudent(student);
                  setEditOpen(true);
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--text-muted, #94a3b8)" }}>
              Showing {students.length} of {totalRecords} total student records
            </span>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </>
      )}

      <StudentModal
        open={open}
        onClose={() => setOpen(false)}
        reload={loadStudents}
      />

      <EditStudentModal
        open={editOpen}
        student={selectedStudent}
        onClose={() => {
          setEditOpen(false);
          setSelectedStudent(null);
        }}
        reload={loadStudents}
      />

      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        reload={loadStudents}
      />
    </div>
  );
}

export default Students;