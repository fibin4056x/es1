import TeacherForm from "./TeacherForm";

function TeacherModal({ open, onClose, reload }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>Add Teacher</h2>

          <button onClick={onClose}>✖</button>
        </div>

        <TeacherForm
          onClose={onClose}
          reload={reload}
        />

      </div>
    </div>
  );
}
export default TeacherModal;