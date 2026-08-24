import Modal from "../../components/common/Modal/Modal";
import DivisionForm from "./DivisionForm";

function DivisionModal({ open, onClose, reload }) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Add Division"
      maxWidth="580px"
    >
      <DivisionForm onClose={onClose} reload={reload} />
    </Modal>
  );
}

export default DivisionModal;