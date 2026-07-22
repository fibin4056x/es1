import TeacherForm from "./TeacherForm";

function EditTeacherModal({
  open,
  onClose,
  teacher,
  reload,
}) {
  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-teacher-title"
    >
      <div
        className="modal obsidian-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="edit-teacher-title">Edit Teacher</h2>

          <button
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close Edit Teacher Modal"
          >
            ✕
          </button>
        </div>

        <TeacherForm
          teacher={teacher}
          reload={reload}
          onClose={onClose}
          isEdit
        />
      </div>
    </div>
  );
}

export default EditTeacherModal;