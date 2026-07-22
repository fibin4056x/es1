import TeacherForm from "./TeacherForm";

function TeacherModal({
  open,
  onClose,
  reload,
}) {
  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-teacher-title"
    >
      <div
        className="modal obsidian-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="add-teacher-title">Add Teacher</h2>

          <button
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close Add Teacher Modal"
          >
            ✕
          </button>
        </div>

        <TeacherForm
          reload={reload}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

export default TeacherModal;