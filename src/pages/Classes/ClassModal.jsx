import ClassForm from "./ClassForm";

function ClassModal({
  open,
  onClose,
  reload,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>Add Class</h2>

          <button
            onClick={onClose}
          >
            ✖
          </button>

        </div>

        <ClassForm
          onClose={onClose}
          reload={reload}
        />

      </div>

    </div>
  );
}

export default ClassModal;