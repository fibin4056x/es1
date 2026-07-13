import { toast } from "react-toastify";

import {
  deleteDivision,
} from "../../services/divisionService";

function DivisionRow({
  division,
  reload,
  onEdit,
}) {

  const handleDelete = async () => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this division?"
      );

    if (!confirmDelete) return;

    try {

      await deleteDivision(
        division._id
      );

      toast.success(
        "Division deleted successfully"
      );

      reload();

    } catch (error) {

      console.log(error);

      toast.error(
        "Unable to delete division"
      );

    }

  };

  return (

    <tr>

      <td>
        {division.classId?.name || "-"}
      </td>

      <td>{division.name}</td>

      <td>
        {division.assignedTeacher?.name ||
          "Not Assigned"}
      </td>

      <td>{division.capacity}</td>

      <td>{division.status}</td>

      <td>

        <button
          onClick={() =>
            onEdit(division)
          }
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
        >
          Delete
        </button>

      </td>

    </tr>

  );

}

export default DivisionRow;