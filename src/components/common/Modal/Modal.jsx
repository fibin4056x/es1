import React from "react";
import "./Modal.css";

export default function Modal({
  isOpen,
  open,
  onClose,
  title,
  children,
  maxWidth = "550px",
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
          <h2 className="modal-title">{title}</h2>
          <button
            type="button"
            className="close-modal-btn"
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
