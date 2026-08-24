import Modal from "../../components/common/Modal/Modal";
import TeacherForm from "./TeacherForm";

function EditTeacherModal({ open, onClose, teacher, reload }) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Edit Teacher"
      maxWidth="480px"
    >
      <TeacherForm
        teacher={teacher}
        reload={reload}
        onClose={onClose}
        isEdit
      />
    </Modal>
  );
}

export default EditTeacherModal;