import StudentForm from "./StudentForm";

function EditStudentModal({
  open,
  student,
  onClose,
  reload,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">

          <h2>Edit Student</h2>

          <button
            onClick={onClose}
          >
            ✖
          </button>

        </div>

        <StudentForm
          student={student}
          isEdit={true}
          onClose={onClose}
          reload={reload}
        />

      </div>
    </div>
  );
}

export default EditStudentModal;