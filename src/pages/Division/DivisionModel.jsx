import DivisionForm from "./DivisionForm";
import "./DivisionModal.css"
function DivisionModal({
  open,
  onClose,
  reload,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>Add Division</h2>

          <button onClick={onClose}>
            ✖
          </button>

        </div>

        <DivisionForm
          onClose={onClose}
          reload={reload}
        />

      </div>

    </div>
  );
}

export default DivisionModal;