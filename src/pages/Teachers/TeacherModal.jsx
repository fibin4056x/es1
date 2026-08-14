import Modal from "../../components/common/Modal/Modal";
import TeacherForm from "./TeacherForm";

function TeacherModal({ open, onClose, reload }) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Add New Teacher"
      maxWidth="480px"
    >
      <TeacherForm reload={reload} onClose={onClose} />
    </Modal>
  );
}

export default TeacherModal;