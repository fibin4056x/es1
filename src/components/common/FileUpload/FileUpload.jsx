import { useRef, useState } from "react";
import "./FileUpload.css";


function FileUpload({
  onFileSelect,
  accept = ".csv, .xlsx, .xls",
  maxSizeMB = 10,
  label = "Drag and drop your file here, or click to browse",
  subtitle = "Supports CSV, XLSX, and XLS (Max 10MB)",
  progress = null,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (file) => {
    if (!file) return;
    setError("");

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="file-upload-wrapper">
      <div
        className={`file-upload-dropzone ${isDragOver ? "dropzone-active" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleInputChange}
          className="file-upload-input"
        />

        <div className="file-upload-icon-container">
          <span className="material-symbols-outlined file-upload-icon">
            cloud_upload
          </span>
        </div>

        <p className="file-upload-label">{label}</p>
        <p className="file-upload-subtitle">{subtitle}</p>
      </div>

      {error && <p className="file-upload-error">{error}</p>}

      {selectedFile && (
        <div className="selected-file-preview">
          <span className="material-symbols-outlined file-icon">
            description
          </span>
          <div className="file-info">
            <span className="file-name">{selectedFile.name}</span>
            <span className="file-size">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
          <button
            type="button"
            className="file-remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
              if (onFileSelect) onFileSelect(null);
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {progress !== null && (
        <div className="file-progress-bar-container">
          <div className="progress-bar-header">
            <span>Uploading & Processing...</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
