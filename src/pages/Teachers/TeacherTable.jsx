import TeacherRow from "./TeacherRow";
function TeacherTable({
  teachers,
  reload,
  onEdit,
}) {

  return (

    <table width="100%">

      <thead>

        <tr>

          <th>Name</th>

          <th>Email</th>

          <th>Status</th>

          <th>Action</th>

        </tr>

      </thead>
<tbody>
  {teachers.length === 0 ? (
    <tr>
      <td
        colSpan="4"
        style={{
          textAlign: "center",
          padding: "50px 20px",
        }}
      >
        <h3>No teachers found</h3>

        <p>
          Try another search or add a new teacher.
        </p>
      </td>
    </tr>
  ) : (
    teachers.map((teacher) => (
      <TeacherRow
        key={teacher._id}
        teacher={teacher}
        reload={reload}
        onEdit={onEdit}
      />
    ))
  )}
</tbody>

    </table>

  );

}

export default TeacherTable;