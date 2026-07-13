import StudentRow from "./StudentRow";

function StudentTable({
  students,
  reload,
  onEdit,
}) {
  return (
    <table width="100%">

      <thead>

        <tr>
          <th>Admission No</th>
          <th>Name</th>
          <th>Class</th>
          <th>Division</th>
          <th>Status</th>
          <th>Action</th>
        </tr>

      </thead>

      <tbody>

        {students.length === 0 ? (

          <tr>

            <td
              colSpan="6"
              style={{
                textAlign:"center",
                padding:"40px",
              }}
            >
              <h3>No students found</h3>

              <p>
                Try another search or add a student.
              </p>

            </td>

          </tr>

        ) : (

          students.map((student)=>(

            <StudentRow
              key={student._id}
              student={student}
              reload={reload}
              onEdit={onEdit}
            />

          ))

        )}

      </tbody>

    </table>
  );
}

export default StudentTable;
