import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import { deleteClass } from "../../services/ClassService";

function ClassRow({ classData, reload, onEdit }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteClass(classData._id);
      toast.success("Class deleted successfully");
      setConfirmOpen(false);
      reload();
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <tr>
        <td>{classData.name}</td>
        <td>{classData.academicYear}</td>
        <td>
          <span
            className={`status-badge ${
              classData.status === "active" ? "badge-active" : "badge-inactive"
            }`}
          >
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
        title="Delete Class"
        message={`Are you sure you want to delete ${classData.name}? This action cannot be undone.`}
        confirmText="Delete Class"
        loading={loading}
      />
    </>
  );
}

export default ClassRow;