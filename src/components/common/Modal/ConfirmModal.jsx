import Modal from "./Modal";
import "./ConfirmModal.css";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to perform this action? This cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger",
  loading = false,
}) {
  if (!isOpen) return null;

  const iconName = type === "danger" ? "warning" : type === "warning" ? "error" : "help";
  const iconClass = type === "danger" ? "confirm-icon-danger" : type === "warning" ? "confirm-icon-warning" : "confirm-icon-info";
  const buttonClass = type === "danger" ? "confirm-btn-danger" : "confirm-btn-primary";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="460px"
    >
      <div className="confirm-modal-content">
        <div className="confirm-modal-body">
          <div className={`confirm-icon-wrapper ${iconClass}`}>
            <span className="material-symbols-outlined">{iconName}</span>
          </div>
          <div className="confirm-text-group">
            <p className="confirm-message">{message}</p>
          </div>
        </div>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-btn-cancel btn-press"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`${buttonClass} btn-press`}
            onClick={() => {
              onConfirm();
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined confirm-spinner">progress_activity</span>
                <span>Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
