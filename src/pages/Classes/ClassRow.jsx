import { toast } from "react-toastify";

import {
  deleteClass,
} from "../../services/classService";

function ClassRow({
  classData,
  reload,
  onEdit,
}) {
  const handleDelete = async () => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this class?"
      );

    if (!confirmDelete) return;

    try {

      await deleteClass(
        classData._id
      );

      toast.success(
        "Class deleted successfully"
      );

      reload();

    } catch (error) {

      console.log(error);

      toast.error(
        "Unable to delete class"
      );

    }

  };

  return (
    <tr>
      <td>{classData.name}</td>
      <td>{classData.academicYear}</td>
      <td>
        <span className={`status-badge ${classData.status === "active" ? "badge-active" : "badge-inactive"}`}>
          {classData.status || "inactive"}
        </span>
      </td>
      <td>
        <div className="table-actions">
          <button
            className="action-btn edit-btn btn-press"
            onClick={() => onEdit(classData)}
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

export default ClassRow;