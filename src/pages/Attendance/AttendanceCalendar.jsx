import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Calendar from "../../components/common/Calendar/Calendar";
import StatCard from "../../components/common/StatCard/StatCard";
import FilterBar from "../../components/common/FilterBar/FilterBar";
import Modal from "../../components/common/Modal/Modal";
import { useAuth } from "../../hooks/UseAuth";
import { getAttendanceByDate } from "../../services/AttendanceService";
import { getClassList } from "../../services/ClassService";
import { getDivisionList } from "../../services/DivisionService";
import { getTeacherList } from "../../services/TeacherService";
import "./AttendanceCalendar.css";

function AttendanceCalendar() {
  const { user } = useAuth();
  const isPrincipal = user?.role === "principal";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayAttendance, setDayAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters (Principal & Teacher)
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Student Attendance Modal
  const [selectedStudentRecord, setSelectedStudentRecord] = useState(null);
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  // Stats calculation
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    percentage: 0,
  });

  // Load dropdowns
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [clsRes, divRes, teachRes] = await Promise.all([
          getClassList().catch(() => ({ data: [] })),
          getDivisionList().catch(() => ({ data: [] })),
          isPrincipal ? getTeacherList().catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ]);

        const clsData = clsRes.data || clsRes || [];
        const divData = divRes.data || divRes || [];
        const teachData = teachRes.data || teachRes || [];

        setClasses(clsData);
        setDivisions(divData);
        setTeachers(teachData);

        if (divData.length > 0) {
          setSelectedDivision(divData[0]._id);
        }
      } catch (err) {
        console.error("Failed to load attendance dropdown filters:", err);
      }
    };
    loadDropdowns();
  }, [isPrincipal]);

  // Fetch attendance for selected division and date
  const fetchAttendanceData = useCallback(async () => {
    if (!selectedDivision) return;
    setLoading(true);
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const res = await getAttendanceByDate(selectedDivision, formattedDate);
      const records = res.data?.students || res.students || res.data || [];
      setDayAttendance(records);

      // Compute statistics
      let p = 0, a = 0, l = 0, lv = 0;
      records.forEach((rec) => {
        const st = rec.status?.toLowerCase();
        if (st === "present") p++;
        else if (st === "absent") a++;
        else if (st === "late") l++;
        else if (st === "leave") lv++;
      });

      const total = records.length;
      const pct = total > 0 ? Math.round(((p + l) / total) * 100) : 0;

      setStats({
        present: p,
        absent: a,
        late: l,
        leave: lv,
        percentage: pct,
      });
    } catch (err) {
      toast.error("Could not fetch attendance records for date.");
      setDayAttendance([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDivision, selectedDate]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleStudentClick = (studentRec) => {
    setSelectedStudentRecord(studentRec);
    setStudentModalOpen(true);
  };

  const activeCount =
    (selectedClass ? 1 : 0) +
    (selectedDivision ? 1 : 0) +
    (selectedTeacher ? 1 : 0);

  return (
    <div className="attendance-calendar-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Calendar</h1>
          <p className="page-subtitle">
            {isPrincipal
              ? "School-wide attendance overview, statistics, and highlights."
              : "Track and review daily class attendance records."}
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <FilterBar
        activeCount={activeCount}
        onReset={() => {
          setSelectedClass("");
          if (divisions.length > 0) setSelectedDivision(divisions[0]._id);
          setSelectedTeacher("");
        }}
      >
        {isPrincipal && (
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        )}

        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
        >
          <option value="">-- Select Division --</option>
          {divisions.map((div) => (
            <option key={div._id} value={div._id}>
              {div.name}
            </option>
          ))}
        </select>

        {isPrincipal && (
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="">All Teachers</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name || t.fullName}
              </option>
            ))}
          </select>
        )}
      </FilterBar>

      {/* STAT CARDS */}
      <div className="summary-cards-grid">
        <StatCard
          title="Attendance Rate"
          value={`${stats.percentage}%`}
          subtitle="Present + Late percentage"
          icon="pie_chart"
          iconBg="var(--primary-light)"
          iconColor="var(--primary)"
          trend={stats.percentage > 85 ? "+Good" : "-Requires Attention"}
          trendType={stats.percentage > 85 ? "up" : "down"}
        />
        <StatCard
          title="Present"
          value={stats.present}
          subtitle="Students Present"
          icon="check_circle"
          iconBg="var(--success-light)"
          iconColor="var(--success)"
        />
        <StatCard
          title="Absent"
          value={stats.absent}
          subtitle="Students Unexcused"
          icon="cancel"
          iconBg="var(--danger-light)"
          iconColor="var(--danger)"
        />
        <StatCard
          title="Late / Leave"
          value={`${stats.late} / ${stats.leave}`}
          subtitle="Late Arrivals & On Leave"
          icon="schedule"
          iconBg="var(--warning-light)"
          iconColor="var(--warning)"
        />
      </div>

      {/* MAIN TWO-COLUMN SECTION */}
      <div className="att-calendar-layout">
        {/* CALENDAR ENGINE */}
        <div className="att-calendar-card">
          <Calendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onCellClick={handleDateClick}
            loading={loading}
          />
        </div>

        {/* DAILY ATTENDANCE BREAKDOWN PANEL */}
        <div className="att-day-details-panel">
          <div className="panel-date-header">
            <h3>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
            <span className="record-count-badge">
              {dayAttendance.length} Students
            </span>
          </div>

          <div className="student-attendance-list">
            {dayAttendance.length === 0 ? (
              <div className="empty-day-attendance">
                <span className="material-symbols-outlined">how_to_reg</span>
                <p>No attendance recorded for this date.</p>
              </div>
            ) : (
              dayAttendance.map((studentRec, idx) => {
                const status = (studentRec.status || "present").toLowerCase();

                return (
                  <div
                    key={studentRec._id || idx}
                    className="student-att-item"
                    onClick={() => handleStudentClick(studentRec)}
                  >
                    <div className="student-main-info">
                      <div className="student-avatar-chip">
                        {studentRec.studentName?.charAt(0) || "S"}
                      </div>
                      <div>
                        <h4 className="student-name">
                          {studentRec.studentName || studentRec.name || `Student #${idx + 1}`}
                        </h4>
                        <span className="student-roll">
                          Roll: {studentRec.rollNumber || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="student-att-right">
                      <span className={`status-pill status-${status}`}>
                        {status}
                      </span>
                      {studentRec.documents?.length > 0 && (
                        <span
                          className="material-symbols-outlined doc-indicator"
                          title="Attachment / PDF Available"
                        >
                          attach_file
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* STUDENT DETAIL MODAL */}
      {selectedStudentRecord && (
        <Modal
          isOpen={studentModalOpen}
          onClose={() => setStudentModalOpen(false)}
          title="Attendance Record Details"
          maxWidth="500px"
        >
          <div className="student-att-modal-content">
            <div className="modal-student-header">
              <div className="modal-avatar">
                {selectedStudentRecord.studentName?.charAt(0) || "S"}
              </div>
              <div>
                <h3>{selectedStudentRecord.studentName || "Student Details"}</h3>
                <p>Roll No: {selectedStudentRecord.rollNumber || "N/A"}</p>
              </div>
            </div>

            <div className="modal-att-details-grid">
              <div className="modal-detail-row">
                <span>Date:</span>
                <strong>
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>
              </div>

              <div className="modal-detail-row">
                <span>Status:</span>
                <span className={`status-pill status-${(selectedStudentRecord.status || "present").toLowerCase()}`}>
                  {selectedStudentRecord.status}
                </span>
              </div>

              <div className="modal-detail-row">
                <span>Reason / Remarks:</span>
                <strong>
                  {selectedStudentRecord.reason || selectedStudentRecord.remarks || "None provided"}
                </strong>
              </div>

              {selectedStudentRecord.documents?.length > 0 && (
                <div className="modal-documents-section">
                  <span>Attached Document (PDF):</span>
                  <div className="doc-link-list">
                    {selectedStudentRecord.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="pdf-download-link"
                      >
                        <span className="material-symbols-outlined">picture_as_pdf</span>
                        View Document {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AttendanceCalendar;
