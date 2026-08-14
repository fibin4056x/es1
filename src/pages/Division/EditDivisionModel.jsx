import Modal from "../../components/common/Modal/Modal";
import DivisionForm from "./DivisionForm";

function EditDivisionModal({ open, division, onClose, reload }) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Edit Division"
      maxWidth="580px"
    >
      <DivisionForm
        division={division}
        isEdit={true}
        onClose={onClose}
        reload={reload}
      />
    </Modal>
  );
}

export default EditDivisionModal;