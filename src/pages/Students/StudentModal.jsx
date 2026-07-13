import StudentForm from "./StudentForm";

function StudentModal({
  open,
  onClose,
  reload,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">

          <h2>Add Student</h2>

          <button
            onClick={onClose}
          >
            ✖
          </button>

        </div>

        <StudentForm
          onClose={onClose}
          reload={reload}
        />

      </div>
    </div>
  );
}

export default StudentModal;