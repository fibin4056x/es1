import Modal from "../../components/common/Modal/Modal";
import ClassForm from "./ClassForm";

function ClassModal({ open, onClose, reload }) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Add Class"
      maxWidth="500px"
    >
      <ClassForm onClose={onClose} reload={reload} />
    </Modal>
  );
}

export default ClassModal;