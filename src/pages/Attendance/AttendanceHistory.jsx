import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getClasses } from "../../services/ClassService";
import { getDivisions } from "../../services/DivisionService";
import { getAttendanceHistory } from "../../services/AttendanceService";
import { getStudentsByDivision } from "../../services/StudentService";
import "./AttendanceHistory.css";

function AttendanceHistory() {
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [students, setStudents] = useState([]);

  const [classId, setClassId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadDropdowns = async () => {
      try {
        const [classRes, divisionRes] = await Promise.all([
          getClasses(),
          getDivisions(),
        ]);
        if (isMounted) {
          setClasses(classRes.data || []);
          setDivisions(divisionRes.data || []);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          toast.error("Failed to load classes and divisions.");
        }
      }
    };
    Promise.resolve().then(loadDropdowns);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!divisionId) {
      Promise.resolve().then(() => {
        setStudents([]);
        setHistoryData([]);
      });
      return;
    }


    let isMounted = true;
    const fetchHistoryAndStudents = async () => {
      try {
        setLoading(true);
        const [studentRes, historyRes] = await Promise.all([
          getStudentsByDivision(divisionId),
          getAttendanceHistory(divisionId, 1, 100),
        ]);

        if (isMounted) {
          setStudents(studentRes.data || []);
          setHistoryData(historyRes.data || historyRes || []);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          toast.error("Failed to load attendance history.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    Promise.resolve().then(fetchHistoryAndStudents);
    return () => {
      isMounted = false;
    };
  }, [divisionId]);

  const filteredDivisions = divisions.filter(
    (d) => (d.classId?._id || d.classId) === classId
  );

  const selectedStudent = students.find((s) => s._id === selectedStudentId);

  const filteredHistory = historyData.filter((record) => {
    const recordStudentId = record.studentId?._id || record.studentId;
    if (selectedStudentId && recordStudentId !== selectedStudentId) {
      return false;
    }
    if (selectedMonth && record.date) {
      return record.date.slice(0, 7) === selectedMonth;
    }
    return true;
  });

  const totalRecords = filteredHistory.length;
  const presentRecords = filteredHistory.filter((r) => r.status === "present").length;
  const attendancePercentage =
    totalRecords > 0 ? ((presentRecords / totalRecords) * 100).toFixed(1) : "0.0";

  return (
    <div className="attendance-history-page animate-fade-in-up">
      {/* Header */}
      <div className="history-header">
        <div>
          <h1>Attendance History</h1>
          <p>View attendance records, reasons, and supporting documents.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="history-card glass-card">
        <h3>Filters</h3>
        <div className="history-filter-grid">
          <select
            value={classId}
            onChange={(e) => {
              setClassId(e.target.value);
              setDivisionId("");
              setSelectedStudentId("");
            }}
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={divisionId}
            onChange={(e) => {
              setDivisionId(e.target.value);
              setSelectedStudentId("");
            }}
            disabled={!classId}
          >
            <option value="">Select Division</option>
            {filteredDivisions.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            disabled={!divisionId}
          >
            <option value="">All Students</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.nameEnglish} ({s.admissionNumber})
              </option>
            ))}
          </select>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {/* Student Details */}
      {selectedStudent && (
        <div className="history-card glass-card">
          <h3>Student Information</h3>
          <div className="student-info-grid">
            <div>
              <span>Name</span>
              <strong>{selectedStudent.nameEnglish}</strong>
            </div>
            <div>
              <span>Admission No.</span>
              <strong>{selectedStudent.admissionNumber}</strong>
            </div>
            <div>
              <span>Class</span>
              <strong>{classes.find((c) => c._id === classId)?.name || "—"}</strong>
            </div>
            <div>
              <span>Division</span>
              <strong>{divisions.find((d) => d._id === divisionId)?.name || "—"}</strong>
            </div>
            <div>
              <span>Attendance %</span>
              <strong>{attendancePercentage}%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Attendance History Table */}
      <div className="history-card glass-card">
        <h3>Attendance Log ({filteredHistory.length} records)</h3>
        {loading ? (
          <p className="loading-text">Loading history records...</p>
        ) : filteredHistory.length === 0 ? (
          <p className="empty-text">No attendance history records found for the selected filters.</p>
        ) : (
          <div className="table-responsive">
            <table className="attendance-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Documents</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((record, index) => (
                  <tr key={record._id || index}>
                    <td>{record.date ? new Date(record.date).toLocaleDateString() : "—"}</td>
                    <td>{record.studentId?.nameEnglish || record.studentName || "—"}</td>
                    <td>
                      <span className={`status-badge status-${record.status}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.reason || "—"}</td>
                    <td>{record.documents?.length || 0} attached</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceHistory;