import TeacherForm from "./TeacherForm";

function EditTeacherModal({
  open,
  onClose,
  teacher,
  reload,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>Edit Teacher</h2>

          <button onClick={onClose}>
            ✖
          </button>
        </div>

        <TeacherForm
          teacher={teacher}
          onClose={onClose}
          reload={reload}
          isEdit={true}
        />

      </div>
    </div>
  );
}

export default EditTeacherModal;