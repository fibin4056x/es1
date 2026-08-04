import { useState } from "react";
import AttendanceToolbar from "./AttendanceToolbar";
import AttendanceTable from "./AttendanceTable";
import AttendanceDocumentModal from "./AttendanceDocumentModal";
import { markAttendance, deleteAttendance } from "../../services/AttendanceService";
import { useAuth } from "../../hooks/UseAuth";

import { toast } from "react-toastify";
import { getStudentId } from "../../util/helpers";
import "./Attendance.css";

function TableSkeleton() {
  return (
    <div className="table-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-line" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton-cell w-20" />
          <div className="skeleton-cell w-40" />
          <div className="skeleton-cell w-20" />
          <div className="skeleton-cell w-30" />
          <div className="skeleton-cell w-10" />
          <div className="skeleton-cell w-10" />
        </div>
      ))}
    </div>
  );
}

function Attendance() {
  const { user } = useAuth();
const role = user?.role?.toLowerCase();

const canEditAttendance =
  role === "teacher" || role === "principal";
  const [students, setStudents] = useState([]);
  const [divisionId, setDivisionId] = useState("");
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeAttendance, setActiveAttendance] = useState(null);

  const totalStudents = students.length;
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const absentCount = attendance.filter((a) => a.status === "absent").length;
  const lateCount = attendance.filter((a) => a.status === "late").length;
  const leaveCount = attendance.filter((a) => a.status === "leave").length;
  const attendanceRate = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : "0.0";

  /* =========================================
     SAVE ATTENDANCE
  ========================================= */

  const handleSaveAttendance = async () => {
    if (!classId) {
      return toast.error("Please select a class.");
    }

    if (!divisionId) {
      return toast.error("Please select a division.");
    }

    if (attendance.length === 0) {
      return toast.error("Please mark attendance before saving.");
    }

    try {
      setLoading(true);

      const sanitizedStudents = attendance.map((item) => {
        const payloadItem = {
          studentId: getStudentId(item.studentId),
          status: item.status || "present",
          reason: item.status === "present" ? "" : item.reason || "",
        };
        if (item._id) {
          payloadItem._id = item._id;
        }
        return payloadItem;
      });

      const response = await markAttendance({
        date,
        classId,
        divisionId,
        students: sanitizedStudents,
      });

const records = response.data?.data;

if (Array.isArray(records)) {
  const normalized = records.map((record) => ({
    ...record,
    studentId: record.studentId,
    documents: record.documents || [],
  }));

  setAttendance(normalized);
}


      toast.success("Attendance marked successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     DELETE ATTENDANCE
  ========================================= */

  const handleDeleteAttendance = async (attendanceId, studentId) => {
    if (!canEditAttendance) {
      return toast.error("You do not have permission to delete attendance.");
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this attendance record? This will also remove any uploaded documents for this student on this date."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await deleteAttendance(attendanceId);

      // Reset the local state for this student to defaults
      setAttendance((prev) =>
        prev.map((item) =>
          item._id === attendanceId
            ? {
                _id: null,
                studentId,
                status: "present",
                reason: "",
                documents: [],
              }
            : item
        )
      );

      toast.success("Attendance record deleted successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete attendance record."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-page animate-fade-in-up">
      <AttendanceToolbar
        students={students}
        setStudents={setStudents}
        setAttendance={setAttendance}
        classId={classId}
        setClassId={setClassId}
        divisionId={divisionId}
        setDivisionId={setDivisionId}
        date={date}
        setDate={setDate}
        loading={loading}
        setLoading={setLoading}
      />

      {loading && students.length === 0 ? (
        <div className="glass-card table-card">
          <TableSkeleton />
        </div>
      ) : students.length === 0 ? (
        <div className="glass-card empty-state-card">
          <span className="material-symbols-outlined empty-icon">
            assignment_late
          </span>

          <h3>No students loaded</h3>

          <p>
            Please select a class and division, then click "Load Students".
          </p>
        </div>
      ) : (
        <>
          {/* Attendance Quick Stats */}
          <div className="attendance-stats-grid">
            <div className="attendance-stat-chip present">
              <span className="chip-dot green"></span>
              <span className="chip-label">Present:</span>
              <span className="chip-value">{presentCount}</span>
            </div>
            <div className="attendance-stat-chip absent">
              <span className="chip-dot red"></span>
              <span className="chip-label">Absent:</span>
              <span className="chip-value">{absentCount}</span>
            </div>
            <div className="attendance-stat-chip late">
              <span className="chip-dot yellow"></span>
              <span className="chip-label">Late:</span>
              <span className="chip-value">{lateCount}</span>
            </div>
            <div className="attendance-stat-chip leave">
              <span className="chip-dot blue"></span>
              <span className="chip-label">On Leave:</span>
              <span className="chip-value">{leaveCount}</span>
            </div>
            <div className="attendance-stat-chip rate">
              <span className="material-symbols-outlined rate-icon">analytics</span>
              <span className="chip-label">Rate:</span>
              <span className="chip-value">{attendanceRate}%</span>
            </div>
          </div>

          <div className="glass-card table-card">
            <div className="table-responsive">
          <AttendanceTable
  students={students}
  attendance={attendance}
  setAttendance={setAttendance}
  canEditAttendance={canEditAttendance}
  onManageDocuments={(record) => setActiveAttendance(record)}
  onDeleteAttendance={handleDeleteAttendance}
  loading={loading}
/>
            </div>
          </div>

          {canEditAttendance && (
            <div className="attendance-actions">
              <button
                className="save-attendance-btn btn-press"
                onClick={handleSaveAttendance}
                disabled={loading}
              >
                <span className="material-symbols-outlined">
                  {loading ? "progress_activity" : "save"}
                </span>

                <span>{loading ? "Saving..." : "Save Attendance"}</span>
              </button>
            </div>
          )}
        </>
      )}

      {activeAttendance && (
        <AttendanceDocumentModal
  open={!!activeAttendance}
  onClose={() => setActiveAttendance(null)}
  attendanceRecord={activeAttendance}
  canEditAttendance={canEditAttendance}
  onUpdateRecord={(updatedRecord) => {
            setAttendance((prev) =>
              prev.map((item) =>
                item._id === updatedRecord._id
                  ? {
                      ...updatedRecord,
                      studentId: updatedRecord.studentId,
                      documents: updatedRecord.documents || [],
                    }
                  : item
              )
            );
            setActiveAttendance(updatedRecord);
          }}
        />
      )}
    </div>
  );
}

export default Attendance;
