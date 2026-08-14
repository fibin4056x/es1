import "./Modal.css";

export default function Modal({
  isOpen,
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "560px",
  icon,
}) {
  const isModalOpen = isOpen !== undefined ? isOpen : open;

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card glass-card animate-scale-up"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrapper">
            {icon && (
              <span className="material-symbols-outlined modal-header-icon">
                {icon}
              </span>
            )}
            <div>
              <h2 className="modal-title">{title}</h2>
              {subtitle && <p className="modal-subtitle">{subtitle}</p>}
            </div>
          </div>

          <button
            type="button"
            className="close-modal-btn btn-press"
            onClick={onClose}
            aria-label="Close Modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
