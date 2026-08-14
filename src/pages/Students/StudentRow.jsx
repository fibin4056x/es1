import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import { deleteStudent } from "../../services/StudentService";

function StudentRow({ student, reload, onEdit }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteStudent(student._id);
      toast.success("Student deleted successfully");
      setConfirmOpen(false);
      reload();
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete student");
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl =
    student.photo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(student.nameEnglish || "Student")}`;

  return (
    <>
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
            <span className="student-name-label">{student.nameEnglish}</span>
          </div>
        </td>
        <td>{student.classId?.name || "-"}</td>
        <td>{student.divisionId?.name || "-"}</td>
        <td>
          <span
            className={`status-badge ${
              student.status === "active" ? "badge-active" : "badge-inactive"
            }`}
          >
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
              onClick={() => setConfirmOpen(true)}
              title="Delete"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </td>
      </tr>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${student.nameEnglish || "this student"}? This action cannot be undone.`}
        confirmText="Delete Student"
        loading={loading}
      />
    </>
  );
}

export default StudentRow;