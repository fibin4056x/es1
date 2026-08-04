import { toast } from "react-toastify";

import {
  deleteStudent,
} from "../../services/StudentService";

function StudentRow({
  student,
  reload,
  onEdit,
}) {

  const handleDelete = async () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {

      await deleteStudent(student._id);

      toast.success(
        "Student deleted successfully"
      );

      reload();

    } catch (error) {

      console.log(error);

      toast.error(
        "Unable to delete student"
      );

    }

  };

  const avatarUrl = student.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.nameEnglish || "Student")}`;

  return (
    <tr>
      <td>{student.admissionNumber}</td>
      <td>
        <div className="student-avatar-group">
          <div className="student-avatar-wrapper">
            <img
              className="student-avatar-img"
              src={avatarUrl}
              alt={student.nameEnglish}
            />
          </div>
          <span className="student-name-label">
            {student.nameEnglish}
          </span>
        </div>
      </td>
      <td>{student.classId?.name || "-"}</td>
      <td>{student.divisionId?.name || "-"}</td>
      <td>
        <span className={`status-badge ${student.status === "active" ? "badge-active" : "badge-inactive"}`}>
          {student.status || "inactive"}
        </span>
      </td>
      <td>
        <div className="table-actions">
          <button
            className="action-btn edit-btn btn-press"
            onClick={() => onEdit(student)}
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

export default StudentRow;