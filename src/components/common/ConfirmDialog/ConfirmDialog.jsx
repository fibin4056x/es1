import Modal from "../Modal/Modal";
import "./ConfirmDialog.css";


function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // 'danger' | 'warning' | 'primary'
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="450px">
      <div className="confirm-dialog-body">
        <div className={`confirm-icon-wrapper confirm-${variant}`}>
          <span className="material-symbols-outlined">
            {variant === "danger"
              ? "warning"
              : variant === "warning"
              ? "help_outline"
              : "info"}
          </span>
        </div>
        <p className="confirm-dialog-message">{message}</p>
      </div>

      <div className="confirm-dialog-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className={`btn-confirm btn-${variant}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Processing..." : confirmText}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
