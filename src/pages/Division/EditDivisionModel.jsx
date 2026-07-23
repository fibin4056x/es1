import DivisionForm from "./DivisionForm";
import "./DivisionModal.css";

function EditDivisionModal({
  open,
  division,
  onClose,
  reload,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>Edit Division</h2>

          <button onClick={onClose}>
            ✖
          </button>

        </div>

        <DivisionForm
          division={division}
          isEdit={true}
          onClose={onClose}
          reload={reload}
        />

      </div>

    </div>
  );
}

export default EditDivisionModal;