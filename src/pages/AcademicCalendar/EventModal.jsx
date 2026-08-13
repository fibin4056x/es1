import { useState, useEffect } from "react";
import Modal from "../../components/common/Modal/Modal";

import { useAuth } from "../../hooks/UseAuth";
import "./AcademicCalendar.css";

function EventModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  onRestore,
  event = null,
  classes = [],
  divisions = [],
  loading = false,
}) {
  const { user } = useAuth();
  const isPrincipal = user?.role === "principal";
  const isEditing = Boolean(event && event._id);

  const [formData, setFormData] = useState({
    title: "",
    category: "event",
    target: "school",
    classId: "",
    divisionId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    repeatEveryYear: false,
    academicYear: "2025-2026",
    priority: "normal",
    description: "",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        category: event.category || "event",
        target: event.target || "school",
        classId: event.classId?._id || event.classId || "",
        divisionId: event.divisionId?._id || event.divisionId || "",
        startDate: event.startDate
          ? new Date(event.startDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        endDate: event.endDate
          ? new Date(event.endDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        repeatEveryYear: event.repeatEveryYear || false,
        academicYear: event.academicYear || "2025-2026",
        priority: event.priority || "normal",
        description: event.description || "",
      });
    } else {
      setFormData({
        title: "",
        category: "event",
        target: "school",
        classId: "",
        divisionId: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        repeatEveryYear: false,
        academicYear: "2025-2026",
        priority: "normal",
        description: "",
      });
    }
  }, [event, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditing
          ? isPrincipal
            ? "Edit Academic Event"
            : "Event Details"
          : "Create Academic Event"
      }
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit} className="event-form-body">
        <div className="form-group">
          <label className="form-label">Event Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Annual Sports Day, Mid-term Exam"
            required
            disabled={!isPrincipal}
            className="form-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={!isPrincipal}
              className="form-select"
            >
              <option value="holiday">Holiday</option>
              <option value="vacation">Vacation</option>
              <option value="exam">Exam</option>
              <option value="event">Event</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={!isPrincipal}
              className="form-select"
            >
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Target Audience *</label>
            <select
              name="target"
              value={formData.target}
              onChange={handleChange}
              disabled={!isPrincipal}
              className="form-select"
            >
              <option value="school">Entire School</option>
              <option value="class">Specific Class</option>
              <option value="division">Specific Division</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Academic Year *</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="2025-2026"
              disabled={!isPrincipal}
              className="form-input"
            />
          </div>
        </div>

        {formData.target === "class" && (
          <div className="form-group">
            <label className="form-label">Select Class</label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              disabled={!isPrincipal}
              className="form-select"
            >
              <option value="">-- Choose Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.target === "division" && (
          <div className="form-group">
            <label className="form-label">Select Division</label>
            <select
              name="divisionId"
              value={formData.divisionId}
              onChange={handleChange}
              disabled={!isPrincipal}
              className="form-select"
            >
              <option value="">-- Choose Division --</option>
              {divisions.map((div) => (
                <option key={div._id} value={div._id}>
                  {div.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              disabled={!isPrincipal}
              className="form-input"
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label">End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              disabled={!isPrincipal}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="repeatEveryYear"
              checked={formData.repeatEveryYear}
              onChange={handleChange}
              disabled={!isPrincipal}
            />
            Repeat every year on this date
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details, instructions or agenda..."
            disabled={!isPrincipal}
            className="form-textarea"
          ></textarea>
        </div>

        <div className="event-modal-actions">
          {isEditing && isPrincipal && event.status === "inactive" && onRestore && (
            <button
              type="button"
              className="btn-modal-restore"
              onClick={() => onRestore(event._id)}
              disabled={loading}
            >
              Restore Event
            </button>
          )}

          {isEditing && isPrincipal && event.status !== "inactive" && onDelete && (
            <button
              type="button"
              className="btn-modal-delete"
              onClick={() => onDelete(event._id)}
              disabled={loading}
            >
              Delete Event
            </button>
          )}

          <div className="right-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Close
            </button>
            {isPrincipal && (
              <button
                type="submit"
                className="btn-modal-submit"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Event"
                  : "Create Event"}
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default EventModal;
