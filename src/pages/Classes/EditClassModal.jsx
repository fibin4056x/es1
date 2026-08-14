import Modal from "../../components/common/Modal/Modal";
import ClassForm from "./ClassForm";

function EditClassModal({ open, classData, onClose, reload }) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Edit Class"
      maxWidth="500px"
    >
      <ClassForm
        classData={classData}
        isEdit={true}
        onClose={onClose}
        reload={reload}
      />
    </Modal>
  );
}

export default EditClassModal;