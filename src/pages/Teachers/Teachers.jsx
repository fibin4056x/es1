import { useCallback, useEffect, useMemo, useState } from "react";
import { getTeachers, updateTeacherStatus } from "../../services/teacherService";
import { getDivisions } from "../../services/divisionService";
import { getStudents } from "../../services/studentService";
import { toast } from "react-toastify";
import TeacherToolbar from "./TeacherToolbar";
import TeacherTable from "./TeacherTable";
import TeacherModal from "./TeacherModal";
import EditTeacherModal from "./EditTeacherModel";
import AssignClassModal from "./AssignClassModal";
import "./Teachers.css";

const TEACHERS_PER_PAGE = 5;

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Computer Science",
  "Literature",
];

const STATUS_TRANSITIONS = {
  active: "leave",
  leave: "inactive",
  inactive: "active",
};

/**
 * Derives a teacher's subject.
 * Falls back to a deterministic hash of the teacher's email when no
 * subject is explicitly set, so the same teacher always maps to the
 * same subject across renders.
 */
function getTeacherSubject(teacher) {
  if (teacher.subject) return teacher.subject;
  if (!teacher.email) return SUBJECTS[0];

  const emailLower = teacher.email.toLowerCase();
  if (emailLower.includes("math")) return SUBJECTS[0];
  if (emailLower.includes("phys")) return SUBJECTS[1];
  if (emailLower.includes("chem")) return SUBJECTS[2];
  if (emailLower.includes("eng") || emailLower.includes("lit")) return SUBJECTS[3];
  if (emailLower.includes("cs") || emailLower.includes("comp")) return SUBJECTS[4];

  const charSum = teacher.email
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return SUBJECTS[charSum % SUBJECTS.length];
}

/** Deterministic placeholder attendance percentage derived from teacher id. */
function getAttendancePercentage(teacherId) {
  const numId = (teacherId || "0")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `${((numId % 13) + 85).toFixed(1)}%`;
}

/** Builds initials (max 2 characters) from a teacher's full name. */
function getInitials(name) {
  return (name || "T")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & sorting state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Modal open states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Selected teacher records
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [assignTeacher, setAssignTeacher] = useState(null);

  // Details drawer state
  const [selectedDetailTeacher, setSelectedDetailTeacher] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [teachersRes, divisionsRes, studentsRes] = await Promise.all([
        getTeachers(),
        getDivisions().catch((err) => {
          console.error("Divisions error", err);
          return { data: [] };
        }),
        getStudents().catch((err) => {
          console.error("Students error", err);
          return { data: [] };
        }),
      ]);

      setTeachers(teachersRes.data || []);
      setDivisions(divisionsRes.data || []);
      setStudents(studentsRes.data || []);
    } catch (err) {
      console.error("Error loading teachers data:", err);
      setError("Failed to fetch teacher records. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const loadTeachers = useCallback(async () => {
    try {
      const res = await getTeachers();
      setTeachers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadAssociatedData = useCallback(async () => {
    try {
      const [divisionsRes, studentsRes] = await Promise.all([
        getDivisions().catch(() => ({ data: [] })),
        getStudents().catch(() => ({ data: [] })),
      ]);
      setDivisions(divisionsRes.data || []);
      setStudents(studentsRes.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleReloadAll = useCallback(() => {
    loadTeachers();
    loadAssociatedData();
  }, [loadTeachers, loadAssociatedData]);

  // Map each teacher to their assigned divisions (recomputed only when divisions change)
  const assignedDivisionsMap = useMemo(() => {
    const map = {};
    divisions.forEach((division) => {
      const teacherId = division.assignedTeacher?._id || division.assignedTeacher;
      if (!teacherId) return;
      if (!map[teacherId]) map[teacherId] = [];
      map[teacherId].push(division);
    });
    return map;
  }, [divisions]);

  // Statistics (derived from unfiltered backend data)
  const { totalCount, activeCount, assignedCount, inactiveCount } = useMemo(
    () => ({
      totalCount: teachers.length,
      activeCount: teachers.filter((teacher) => (teacher.status || "active") === "active").length,
      assignedCount: teachers.filter((teacher) => assignedDivisionsMap[teacher._id]?.length > 0)
        .length,
      inactiveCount: teachers.filter((teacher) => teacher.status === "inactive").length,
    }),
    [teachers, assignedDivisionsMap]
  );

  // Filter + sort teachers together, recomputed only when relevant inputs change
  const sortedTeachers = useMemo(() => {
    const searchLower = search.toLowerCase();

    const filtered = teachers.filter((teacher) => {
      const matchesSearch =
        (teacher.name || "").toLowerCase().includes(searchLower) ||
        (teacher.email || "").toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "" ||
        (teacher.status || "active").toLowerCase() === statusFilter.toLowerCase();

      const matchesSubject =
        subjectFilter === "" ||
        getTeacherSubject(teacher).toLowerCase() === subjectFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesSubject;
    });

    const sorted = [...filtered];
    if (sortBy === "name-asc") {
      sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "name-desc") {
      sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } else if (sortBy === "email-asc") {
      sorted.sort((a, b) => (a.email || "").localeCompare(b.email || ""));
    }

    return sorted;
  }, [teachers, search, statusFilter, subjectFilter, sortBy]);

  // Pagination bounds
  const { currentTeachers, firstTeacherIndex, lastTeacherIndex, totalPages } = useMemo(() => {
    const last = currentPage * TEACHERS_PER_PAGE;
    const first = last - TEACHERS_PER_PAGE;
    return {
      currentTeachers: sortedTeachers.slice(first, last),
      firstTeacherIndex: first,
      lastTeacherIndex: last,
      totalPages: Math.ceil(sortedTeachers.length / TEACHERS_PER_PAGE),
    };
  }, [sortedTeachers, currentPage]);

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("");
    setSubjectFilter("");
    setSortBy("");
    setCurrentPage(1);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedDetailTeacher(null);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleSubjectFilterChange = useCallback((value) => {
    setSubjectFilter(value);
    setCurrentPage(1);
  }, []);

  const handleSortByChange = useCallback((value) => {
    setSortBy(value);
    setCurrentPage(1);
  }, []);

  const handleEditTeacher = useCallback((teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  }, []);

  const handleViewDetails = useCallback(
    (teacher) => {
      const teacherDivisions = assignedDivisionsMap[teacher._id] || [];

      setSelectedDetailTeacher({
        ...teacher,
        assignedDivisions: teacherDivisions,
      });
      setIsDrawerOpen(true);
    },
    [assignedDivisionsMap]
  );

  const handleAssignClass = useCallback((teacher) => {
    setAssignTeacher(teacher);
    setIsAssignModalOpen(true);
  }, []);

  const handleOpenAddModal = useCallback(() => setIsAddModalOpen(true), []);
  const handleCloseAddModal = useCallback(() => setIsAddModalOpen(false), []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedTeacher(null);
  }, []);

  const handleCloseAssignModal = useCallback(() => {
    setIsAssignModalOpen(false);
    setAssignTeacher(null);
  }, []);

  const handleEditFromDrawer = useCallback(() => {
    setSelectedTeacher(selectedDetailTeacher);
    setIsEditModalOpen(true);
  }, [selectedDetailTeacher]);

  const handleAssignFromDrawer = useCallback(() => {
    setAssignTeacher(selectedDetailTeacher);
    setIsAssignModalOpen(true);
  }, [selectedDetailTeacher]);

  const handleChangeStatus = useCallback(async () => {
    if (!selectedDetailTeacher) return;

    const currentStatus = selectedDetailTeacher.status || "active";
    const nextStatus = STATUS_TRANSITIONS[currentStatus] || "active";

    try {
      await updateTeacherStatus(selectedDetailTeacher._id, nextStatus);
      toast.success(`Teacher status updated to ${nextStatus}`);

      // Keep drawer state in sync with the update, then refresh the list
      setSelectedDetailTeacher((prev) => (prev ? { ...prev, status: nextStatus } : prev));
      handleReloadAll();
    } catch (err) {
      console.error(err);
      toast.error("Unable to update status");
    }
  }, [selectedDetailTeacher, handleReloadAll]);

  const totalStudentsForDrawer = useMemo(() => {
    if (!selectedDetailTeacher?.assignedDivisions?.length) return 0;
    return students.filter((student) => {
      const studentDivisionId = student.divisionId?._id || student.divisionId;
      return selectedDetailTeacher.assignedDivisions.some(
        (division) => division._id === studentDivisionId
      );
    }).length;
  }, [students, selectedDetailTeacher]);

  const assignedClassNames = useMemo(() => {
    if (!selectedDetailTeacher?.assignedDivisions?.length) return "None";
    const names = selectedDetailTeacher.assignedDivisions.map(
      (division) => division.classId?.name || "Class"
    );
    return Array.from(new Set(names)).join(", ");
  }, [selectedDetailTeacher]);

  const assignedDivisionNames = useMemo(() => {
    if (!selectedDetailTeacher?.assignedDivisions?.length) return "None";
    return selectedDetailTeacher.assignedDivisions.map((division) => division.name).join(", ");
  }, [selectedDetailTeacher]);

  return (
    <div className="teachers-page-container">
      {/* Page Header */}
      <div className="teachers-header-row">
        <div className="teachers-title-group">
          <h1>Teachers</h1>
          <p>Manage educator profiles, assignments, and statuses.</p>
        </div>
        <div>
          <button type="button" className="teachers-add-btn btn-press" onClick={handleOpenAddModal}>
            <span className="material-symbols-outlined">add</span>
            Add Teacher
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="teachers-stats-grid">
        <div className="teacher-stat-card primary">
          <div className="teacher-stat-glow" />
          <div className="teacher-stat-header primary">
            <span className="material-symbols-outlined">groups</span>
            Total Teachers
          </div>
          <div className="teacher-stat-value">{totalCount}</div>
        </div>

        <div className="teacher-stat-card success">
          <div className="teacher-stat-glow" />
          <div className="teacher-stat-header success">
            <span className="material-symbols-outlined">check_circle</span>
            Active Teachers
          </div>
          <div className="teacher-stat-value">{activeCount}</div>
        </div>

        <div className="teacher-stat-card info">
          <div className="teacher-stat-glow" />
          <div className="teacher-stat-header info">
            <span className="material-symbols-outlined">assignment_ind</span>
            Assigned
          </div>
          <div className="teacher-stat-value">{assignedCount}</div>
        </div>

        <div className="teacher-stat-card danger">
          <div className="teacher-stat-glow" />
          <div className="teacher-stat-header danger">
            <span className="material-symbols-outlined">cancel</span>
            Inactive
          </div>
          <div className="teacher-stat-value">{inactiveCount}</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="teachers-main-card">
        <TeacherToolbar
          search={search}
          setSearch={handleSearchChange}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusFilterChange}
          subjectFilter={subjectFilter}
          setSubjectFilter={handleSubjectFilterChange}
          sortBy={sortBy}
          setSortBy={handleSortByChange}
        />

        {error ? (
          <div className="teachers-error-state">
            <span className="material-symbols-outlined teachers-error-state__icon">warning</span>
            <h3 className="teachers-error-state__title">Error Loading Teachers</h3>
            <p className="teachers-error-state__message">{error}</p>
            <button type="button" className="clear-filters-btn" onClick={loadAllData}>
              <span className="material-symbols-outlined">restart_alt</span>
              Retry
            </button>
          </div>
        ) : (
          <>
            <TeacherTable
              teachers={currentTeachers}
              loading={loading}
              reload={handleReloadAll}
              onEdit={handleEditTeacher}
              onViewDetails={handleViewDetails}
              onAssignClass={handleAssignClass}
              assignedDivisionsMap={assignedDivisionsMap}
              onClearFilters={handleClearFilters}
            />

            {!loading && sortedTeachers.length > 0 && (
              <div className="teachers-pagination-row">
                <div className="teachers-pagination-label">
                  Showing {firstTeacherIndex + 1} to{" "}
                  {Math.min(lastTeacherIndex, sortedTeachers.length)} of {sortedTeachers.length}{" "}
                  entries
                </div>
                <div className="teachers-pagination-actions">
                  <button
                    type="button"
                    className="teachers-pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                  >
                    Previous
                  </button>
                  <span className="teachers-pagination-info">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <button
                    type="button"
                    className="teachers-pagination-btn"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((page) => page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <TeacherModal open={isAddModalOpen} onClose={handleCloseAddModal} reload={handleReloadAll} />

      <EditTeacherModal
        open={isEditModalOpen}
        teacher={selectedTeacher}
        onClose={handleCloseEditModal}
        reload={handleReloadAll}
      />

      <AssignClassModal
        open={isAssignModalOpen}
        teacher={assignTeacher}
        onClose={handleCloseAssignModal}
        reload={handleReloadAll}
      />

      {/* Slide-over Right Details Drawer */}
      <div
        className={`teacher-drawer-overlay ${isDrawerOpen ? "open" : ""}`}
        onClick={handleCloseDrawer}
      >
        <div
          className={`teacher-drawer ${isDrawerOpen ? "open" : ""}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="drawer-header">
            <h2>Teacher Details</h2>
            <button type="button" onClick={handleCloseDrawer} className="drawer-close-btn">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {selectedDetailTeacher && (
            <div className="drawer-body">
              {/* Profile Card */}
              <div className="drawer-profile-section">
                {selectedDetailTeacher.avatar ? (
                  <img
                    className="drawer-profile-avatar"
                    src={selectedDetailTeacher.avatar}
                    alt={selectedDetailTeacher.name}
                  />
                ) : (
                  <div className="drawer-profile-initials">
                    {getInitials(selectedDetailTeacher.name)}
                  </div>
                )}
                <div className="drawer-profile-info">
                  <h3>{selectedDetailTeacher.name}</h3>
                  <span className="emp-id">{selectedDetailTeacher.empId}</span>
                  <span className={`teacher-badge ${selectedDetailTeacher.status || "active"}`}>
                    {(selectedDetailTeacher.status || "active").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Details List */}
              <div className="drawer-details-grid">
                <div className="drawer-detail-item">
                  <span className="label">Department</span>
                  <span className="value">Academics</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="label">Subject</span>
                  <span className="value">{getTeacherSubject(selectedDetailTeacher)}</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="label">Qualification</span>
                  <span className="value">
                    {selectedDetailTeacher.qualification || "Master of Education (M.Ed.)"}
                  </span>
                </div>
                <div className="drawer-detail-item">
                  <span className="label">Experience</span>
                  <span className="value">{selectedDetailTeacher.experience || "8 Years"}</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="label">Joining Date</span>
                  <span className="value">{selectedDetailTeacher.joiningDate || "15 Aug 2018"}</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="label">Assigned Classes</span>
                  <span className="value">{assignedClassNames}</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="label">Assigned Divisions</span>
                  <span className="value">{assignedDivisionNames}</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="label">Total Students</span>
                  <span className="value">{totalStudentsForDrawer}</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="label">Attendance Percentage</span>
                  <span className="value">{getAttendancePercentage(selectedDetailTeacher._id)}</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="label">Email</span>
                  <span className="value">{selectedDetailTeacher.email}</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="label">Phone</span>
                  <span className="value">{selectedDetailTeacher.phone}</span>
                </div>
                <div className="drawer-detail-item">
                  <span className="label">Address</span>
                  <span className="value">742 Evergreen Terrace, Springfield</span>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="drawer-actions-section">
                <h4>Quick Actions</h4>
                <div className="drawer-actions-buttons">
                  <button type="button" className="drawer-action-card-btn" onClick={handleEditFromDrawer}>
                    <span className="material-symbols-outlined">edit</span>
                    Edit Teacher
                  </button>
                  <button
                    type="button"
                    className="drawer-action-card-btn"
                    onClick={handleAssignFromDrawer}
                  >
                    <span className="material-symbols-outlined">assignment_ind</span>
                    Assign Class
                  </button>
                  <button type="button" className="drawer-action-card-btn" onClick={handleChangeStatus}>
                    <span className="material-symbols-outlined">sync</span>
                    Change Status
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Teachers;