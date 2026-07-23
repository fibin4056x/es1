import { useState } from "react";

import AttendanceToolbar from "./AttendanceToolbar";
import AttendanceTable from "./AttendanceTable";
import { saveAttendance } from "../../services/attendanceService";
import { toast } from "react-toastify";
import "./Attendance.css";

function Attendance() {
console.log("Attendance page rendered");
  const [students, setStudents] = useState([]);
  const [divisionId, setDivisionId] = useState("");
  const [classId, setClassId] = useState("");
  const [date, setDate] =useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] =useState([]);
   
    const handleSaveAttendance =
  async () => {

    try {

      await saveAttendance({

        date,

        classId,

        divisionId,

        students: attendance,

      });
        
      toast.success(
        "Attendance saved successfully"
      );

    } catch (error) {

      console.log(error);

      console.log(
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
        "Unable to save attendance"
      );

    }

  };
  return (
    <div className="attendance-page animate-fade-in-up">
      <AttendanceToolbar
        setStudents={setStudents}
        setAttendance={setAttendance}
        classId={classId}
        setClassId={setClassId}
        divisionId={divisionId}
        setDivisionId={setDivisionId}
        date={date}
        setDate={setDate}
      />

      {students.length === 0 ? (
        <div className="glass-card empty-state-card">
          <span className="material-symbols-outlined empty-icon">assignment_late</span>
          <h3>No students loaded</h3>
          <p>Please select a class and division, then click "Load Students".</p>
        </div>
      ) : (
        <>
          <div className="glass-card table-card">
            <div className="table-responsive">
              <AttendanceTable
                students={students}
                attendance={attendance}
                setAttendance={setAttendance}
              />
            </div>
          </div>

          <div className="attendance-actions">
           <button
              className="save-attendance-btn btn-press"
              onClick={handleSaveAttendance}
            >
              <span className="material-symbols-outlined">
                save
              </span>

              <span>Save Attendance</span>
            </button>
                      </div>
        </>
      )}
    </div>

  );

}

export default Attendance;