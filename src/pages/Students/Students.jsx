/* eslint-disable */
import { useEffect, useState } from "react";

import { getStudents } from "../../services/StudentService";

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

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  const [open, setOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [importOpen, setImportOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);

      const res = await getStudents();

      setStudents(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      (student.nameEnglish || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (student.admissionNumber || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const lastStudentIndex =
    currentPage * studentsPerPage;

  const firstStudentIndex =
    lastStudentIndex - studentsPerPage;

  const currentStudents =
    filteredStudents.slice(
      firstStudentIndex,
      lastStudentIndex
    );

  const totalPages = Math.ceil(
    filteredStudents.length /
      studentsPerPage
  );

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

      {/* Search Toolbar */}
      <div className="students-toolbar">
        <div className="students-search-wrapper">
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
      </div>

      <StudentStats
        students={students}
      />

      {loading ? (
        <div className="loading-state">
          <p>Loading students...</p>
        </div>
      ) : (
        <>
          <div className="glass-card table-card">
            <div className="table-responsive">
              <StudentTable
                students={currentStudents}
                reload={loadStudents}
                onEdit={(student) => {
                  setSelectedStudent(student);
                  setEditOpen(true);
                }}
              />
            </div>
          </div>

          {filteredStudents.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
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