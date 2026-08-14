import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import "./DivisionRow.css";
import { deleteDivision } from "../../services/DivisionService";

function DivisionRow({ division, reload, onEdit }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteDivision(division._id);
      toast.success("Division deleted successfully");
      setConfirmOpen(false);
      reload();
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete division");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <tr>
        <td>{division.classId?.name || "-"}</td>
        <td>{division.name}</td>
        <td>{division.assignedTeacher?.name || "Not Assigned"}</td>
        <td>{division.capacity}</td>
        <td>
          <span
            className={`status-badge ${
              division.status === "active" ? "badge-active" : "badge-inactive"
            }`}
          >
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
        title="Delete Division"
        message={`Are you sure you want to delete Division ${division.name}? This action cannot be undone.`}
        confirmText="Delete Division"
        loading={loading}
      />
    </>
  );
}

export default DivisionRow;