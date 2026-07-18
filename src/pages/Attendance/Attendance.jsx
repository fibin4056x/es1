import { useState } from "react";

import AttendanceToolbar from "./AttendanceToolbar";
import AttendanceTable from "./AttendanceTable";
import { saveAttendance } from "../../services/attendanceService";
import { toast } from "react-toastify";
import "./Attendance.css";

function Attendance() {

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

    <div>

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
      <AttendanceTable
        students={students}
        attendance={attendance}
        setAttendance={setAttendance}
      />
  <button
  onClick={handleSaveAttendance}
>
  Save Attendance
</button>
    </div>

  );

}

export default Attendance;