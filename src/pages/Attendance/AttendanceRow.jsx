import "./AttendanceRow.css";

function AttendanceRow({
  student,
  attendance,
  setAttendance,
}) {

  const currentAttendance =
    attendance.find(
      (item) => item.studentId === student._id
    );

  const handleStatusChange = (value) => {

    setAttendance(

      attendance.map((item) =>

        item.studentId === student._id
          ? {
              ...item,
              status: value,

              // Clear reason when Present
              reason:
                value === "present"
                  ? ""
                  : item.reason || "",
            }
          : item

      )

    );

  };

  const handleReasonChange = (value) => {

    setAttendance(

      attendance.map((item) =>

        item.studentId === student._id
          ? {
              ...item,
              reason: value,
            }
          : item

      )

    );

  };

  return (

    <tr className="attendance-row">

      <td className="student-admission">
        {student.admissionNumber}
      </td>

      <td className="student-name">
        {student.nameEnglish}
      </td>

      <td className="attendance-status">

        <select
          className={`attendance-select status-${currentAttendance?.status}`}
          value={currentAttendance?.status}
          onChange={(e) =>
            handleStatusChange(e.target.value)
          }
        >

          <option value="present">
            Present
          </option>

          <option value="absent">
            Absent
          </option>

          <option value="late">
            Late
          </option>

        </select>

      </td>

      <td className="attendance-reason">

        <input
          type="text"
          className="attendance-reason-input"
          placeholder={
            currentAttendance?.status === "present"
              ? "Not Required"
              : "Enter reason"
          }
          value={currentAttendance?.reason || ""}
          onChange={(e) =>
            handleReasonChange(e.target.value)
          }
          disabled={
            currentAttendance?.status === "present"
          }
        />

      </td>

    </tr>

  );

}

export default AttendanceRow;