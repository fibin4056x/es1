import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createTeacher,
  updateTeacher,
} from "../../services/TeacherService";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
};

function TeacherForm({
  teacher,
  isEdit = false,
  onClose,
  reload,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isEdit && teacher) {
      setForm({
        name: teacher.name || teacher.fullName || "",
        email: teacher.email || "",
        password: "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [isEdit, teacher]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.warning("Teacher full name is required.");
      return;
    }

    if (!form.email.trim()) {
      toast.warning("Teacher email address is required.");
      return;
    }

    if (!isEdit && !form.password) {
      toast.warning("Password is required for new teacher accounts.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      fullName: form.name.trim(),
      email: form.email.trim().toLowerCase(),
    };

    if (!isEdit || form.password.trim()) {
      payload.password = form.password;
    }

    setLoading(true);

    try {
      if (isEdit) {
        const teacherId = teacher?._id || teacher?.id;
        if (!teacherId) {
          toast.error("Teacher ID is missing.");
          setLoading(false);
          return;
        }
        await updateTeacher(teacherId, payload);
        toast.success("Teacher profile updated successfully.");
      } else {
        await createTeacher(payload);
        toast.success("Teacher account created successfully.");
      }

      reload?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          (isEdit ? "Failed to update teacher." : "Failed to create teacher.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="teacher-form-styled" onSubmit={handleSubmit} noValidate>
      <p className="teacher-form-description">
        {isEdit
          ? "Update the teacher's name, email address, or assign a new password."
          : "Enter the teacher's name, email address, and account credentials."}
      </p>

      <div className="teacher-form-fields">
        {/* Full Name */}
        <div className="teacher-field-group">
          <label htmlFor="teacher-name">
            Full Name <span className="field-required">*</span>
          </label>
          <div className="teacher-input-wrapper">
            <span className="material-symbols-outlined input-icon">person</span>
            <input
              id="teacher-name"
              type="text"
              name="name"
              placeholder="e.g. Eleanor Vance"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              autoComplete="name"
              required
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="teacher-field-group">
          <label htmlFor="teacher-email">
            Email Address <span className="field-required">*</span>
          </label>
          <div className="teacher-input-wrapper">
            <span className="material-symbols-outlined input-icon">alternate_email</span>
            <input
              id="teacher-email"
              type="email"
              name="email"
              placeholder="e.g. eleanor@school.edu"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="teacher-field-group">
          <label htmlFor="teacher-password">
            {isEdit ? "New Password (Optional)" : "Password "}
            {!isEdit && <span className="field-required">*</span>}
          </label>
          <div className="teacher-input-wrapper">
            <span className="material-symbols-outlined input-icon">lock</span>
            <input
              id="teacher-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={
                isEdit
                  ? "Leave blank to keep existing password"
                  : "Enter account password"
              }
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete={isEdit ? "new-password" : "current-password"}
              required={!isEdit}
            />
            <button
              type="button"
              className="password-toggle-button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <span className="material-symbols-outlined">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="teacher-form-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn-submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined spin-animation">progress_activity</span>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">
                {isEdit ? "check_circle" : "person_add"}
              </span>
              <span>{isEdit ? "Update Teacher" : "Create Teacher"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default TeacherForm;