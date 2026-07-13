import DivisionRow from "./DivisionRow";

function DivisionTable({
  divisions,
  reload,
  onEdit,
}) {
  return (
    <table width="100%">

      <thead>

        <tr>

          <th>Class</th>

          <th>Division</th>

          <th>Teacher</th>

          <th>Capacity</th>

          <th>Status</th>

          <th>Action</th>

        </tr>

      </thead>

      <tbody>

        {divisions.length === 0 ? (

          <tr>

            <td
              colSpan="6"
              style={{
                textAlign: "center",
                padding: "40px",
              }}
            >
              <h3>No divisions found</h3>

              <p>
                Add a division to continue.
              </p>

            </td>

          </tr>

        ) : (

          divisions.map((division) => (

            <DivisionRow
              key={division._id}
              division={division}
              reload={reload}
              onEdit={onEdit}
            />

          ))

        )}

      </tbody>

    </table>
  );
}

export default DivisionTable;