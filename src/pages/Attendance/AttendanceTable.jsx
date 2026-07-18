import AttendanceRow
  from "./AttendanceRow";

function AttendanceTable({

  students,

  attendance,

  setAttendance,

}) {

  if (!students.length) {

    return (
      <p>No students found.</p>
    );

  }

  return (

    <table className="attendance-table">

      <thead>

        <tr>

          <th>Admission</th>

          <th>Name</th>

          <th>Status</th>

        </tr>

      </thead>

      <tbody>

        {students.map((student) => (

          <AttendanceRow

            key={student._id}

            student={student}

            attendance={attendance}

            setAttendance={setAttendance}

          />

        ))}

      </tbody>

    </table>

  );

}

export default AttendanceTable;