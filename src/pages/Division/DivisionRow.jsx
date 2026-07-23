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
      <td>{division.classId?.name || "-"}</td>
      <td>{division.name}</td>
      <td>{division.assignedTeacher?.name || "Not Assigned"}</td>
      <td>{division.capacity}</td>
      <td>
        <span className={`status-badge ${division.status === "active" ? "badge-active" : "badge-inactive"}`}>
          {division.status || "inactive"}
        </span>
      </td>
      <td>
        <div className="table-actions">
          <button
            className="action-btn edit-btn btn-press"
            onClick={() => onEdit(division)}
            title="Edit"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
          <button
            className="action-btn delete-btn btn-press"
            onClick={handleDelete}
            title="Delete"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );

}

export default DivisionRow;