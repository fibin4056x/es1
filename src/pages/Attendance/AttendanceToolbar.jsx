import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { isSameStudent } from "../../util/helpers";

import "./AttendanceToolbar.css";

import { getClasses } from "../../services/ClassService";
import { getDivisions } from "../../services/DivisionService";
import { getStudentsByDivision } from "../../services/StudentService";
import { getAttendanceByDate } from "../../services/AttendanceService";

function AttendanceToolbar({
  setStudents,
  setAttendance,

  classId,
  setClassId,

  divisionId,
  setDivisionId,

  date,
  setDate,

  loading,
  setLoading,
}) {

  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);


  /* =========================================
     LOAD CLASSES & DIVISIONS
  ========================================= */

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

    loadDropdowns();
    return () => {
      isMounted = false;
    };
  }, []);

  /* =========================================
     LOAD STUDENTS & ATTENDANCE
  ========================================= */

  const loadStudents = async () => {
    if (!classId) {
      return toast.error("Please select a class.");
    }

    if (!divisionId) {
      return toast.error("Please select a division.");
    }

    try {
      setLoading(true);

      /* ==========================
         LOAD STUDENTS & ATTENDANCE
      ========================== */
      const studentRes = await getStudentsByDivision(divisionId);
      const studentList = studentRes.data || [];
      setStudents(studentList);

      /* ==========================
         LOAD ATTENDANCE
      ========================== */
      const attendanceRes = await getAttendanceByDate(divisionId, date);
      const attendanceData = attendanceRes.data;

      // Merge students and attendanceData to ensure every student has a record in state
      const mergedAttendance = studentList.map((student) => {
        const record = Array.isArray(attendanceData)
          ? attendanceData.find(
              (r) => isSameStudent(r.studentId, student._id)
            )
          : null;

        if (record) {
          return {
            ...record,
            studentId: record.studentId,
            documents: record.documents || [],
          };
        } else {
          return {
            _id: null,
            studentId: student._id,
            status: "present",
            reason: "",
            documents: [],
          };
        }
      });

      setAttendance(mergedAttendance);
      toast.success("Students loaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     FILTER DIVISIONS
  ========================================= */

  const filteredDivisions =
    divisions.filter(
      (division) =>
        division.classId?._id ===
        classId
    );

  return (
    <div className="attendance-toolbar">
      <div className="attendance-toolbar-header">
        <div>
          <h2 className="attendance-title">
            Attendance Management
          </h2>

          <p className="attendance-subtitle">
            Mark and manage
            student attendance.
          </p>
        </div>
      </div>

      <div className="attendance-toolbar-grid">
        {/* DATE */}

        <div className="toolbar-field">
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
          />
        </div>

        {/* CLASS */}

        <div className="toolbar-field">
          <label>Class</label>

          <select
            value={classId}
            onChange={(e) => {
              setClassId(
                e.target.value
              );

              setDivisionId("");

              setStudents([]);

              setAttendance([]);
            }}
          >
            <option value="">
              Select Class
            </option>

            {classes.map(
              (singleClass) => (
                <option
                  key={
                    singleClass._id
                  }
                  value={
                    singleClass._id
                  }
                >
                  {
                    singleClass.name
                  }
                </option>
              )
            )}
          </select>
        </div>

        {/* DIVISION */}

        <div className="toolbar-field">
          <label>Division</label>

          <select
            value={divisionId}
            onChange={(e) => {
              setDivisionId(e.target.value);
              setStudents([]);
              setAttendance([]);
            }}
            disabled={!classId}
          >
            <option value="">
              Select Division
            </option>

            {filteredDivisions.map(
              (division) => (
                <option
                  key={
                    division._id
                  }
                  value={
                    division._id
                  }
                >
                  {division.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* LOAD BUTTON */}

        <div className="toolbar-button">
          <button
            className="attendance-load-btn btn-press"
            onClick={
              loadStudents
            }
            disabled={
              loading ||
              !classId ||
              !divisionId
            }
          >
            <span className="material-symbols-outlined">
              {loading
                ? "progress_activity"
                : "sync"}
            </span>

            <span>
              {loading
                ? "Loading..."
                : "Load Students"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendanceToolbar;