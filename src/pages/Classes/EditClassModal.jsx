import ClassForm from "./ClassForm";

function EditClassModal({
  open,
  classData,
  onClose,
  reload,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>Edit Class</h2>

          <button
            onClick={onClose}
          >
            ✖
          </button>

        </div>

        <ClassForm
          classData={classData}
          isEdit={true}
          onClose={onClose}
          reload={reload}
        />

      </div>

    </div>
  );
}

export default EditClassModal;