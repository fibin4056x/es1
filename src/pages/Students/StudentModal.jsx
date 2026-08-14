import Modal from "../../components/common/Modal/Modal";
import StudentForm from "./StudentForm";

function StudentModal({ open, onClose, reload }) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Add Student"
      maxWidth="680px"
    >
      <StudentForm onClose={onClose} reload={reload} />
    </Modal>
  );
}

export default StudentModal;