import ClassRow from "./ClassRow";

function ClassTable({
  classes,
  reload,
  onEdit,
}) {
  return (
    <table width="100%">

      <thead>

        <tr>

          <th>Class</th>

          <th>
            Academic Year
          </th>

          <th>Status</th>

          <th>Action</th>

        </tr>

      </thead>

      <tbody>

        {classes.length === 0 ? (
          <tr>

            <td
              colSpan="4"
              style={{
                textAlign:
                  "center",
                padding:
                  "40px",
              }}
            >
              <h3>
                No classes found
              </h3>

              <p>
                Add a class to
                continue.
              </p>

            </td>

          </tr>
        ) : (
          classes.map(
            (singleClass) => (
              <ClassRow
                key={
                  singleClass._id
                }
                classData={
                  singleClass
                }
                reload={reload}
                onEdit={onEdit}
              />
            )
          )
        )}

      </tbody>

    </table>
  );
}

export default ClassTable;