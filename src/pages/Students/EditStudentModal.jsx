import Modal from "../../components/common/Modal/Modal";
import StudentForm from "./StudentForm";

function EditStudentModal({ open, student, onClose, reload }) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Edit Student"
      maxWidth="680px"
    >
      <StudentForm
        student={student}
        isEdit={true}
        onClose={onClose}
        reload={reload}
      />
    </Modal>
  );
}

export default EditStudentModal;