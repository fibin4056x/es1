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
    Promise.resolve().then(() => {
      if (isEdit && teacher) {
        setForm({
          name: teacher.name || "",
          email: teacher.email || "",
          password: "",
        });
      } else {
        setForm(INITIAL_FORM);
      }
    });
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
      toast.warning("Teacher name is required.");
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
      email: form.email.trim().toLowerCase(),
    };

    if (!isEdit || form.password.trim()) {
      payload.password = form.password;
    }

    setLoading(true);

    try {
      if (isEdit) {
        await updateTeacher(teacher._id, payload);
        toast.success("Teacher updated successfully.");
      } else {
        await createTeacher(payload);
        toast.success("Teacher created successfully.");
      }

      reload?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          (isEdit
            ? "Unable to update teacher."
            : "Unable to create teacher.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="obsidian-form teacher-form-modern"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="form-subtitle">
        <p>{isEdit ? "Update account credentials and educator details." : "Create a new educator profile and send login credentials."}</p>
      </div>

      {/* Name Input */}
      <div className="form-group">
        <label htmlFor="teacher-name">
          Teacher Name <span className="required-star">*</span>
        </label>
        <div className="input-with-icon">
          <span className="material-symbols-outlined input-prefix-icon">person</span>
          <input
            id="teacher-name"
            type="text"
            name="name"
            placeholder="e.g. Dr. Eleanor Vance"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="form-group">
        <label htmlFor="teacher-email">
          Email Address <span className="required-star">*</span>
        </label>
        <div className="input-with-icon">
          <span className="material-symbols-outlined input-prefix-icon">alternate_email</span>
          <input
            id="teacher-email"
            type="email"
            name="email"
            placeholder="e.g. eleanor.vance@school.edu"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="form-group">
        <label htmlFor="teacher-password">
          {isEdit
            ? "Password (Leave blank to keep current)"
            : "Password "}
          {!isEdit && <span className="required-star">*</span>}
        </label>
        <div className="input-with-icon">
          <span className="material-symbols-outlined input-prefix-icon">key</span>
          <input
            id="teacher-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={
              isEdit
                ? "•••••••• (Leave blank to keep current)"
                : "Enter account password"
            }
            autoComplete={
              isEdit ? "new-password" : "current-password"
            }
            value={form.password}
            onChange={handleChange}
            required={!isEdit}
            disabled={loading}
          />
          <button
            type="button"
            className="password-toggle-btn"
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

      {/* Form Actions */}
      <div className="modal-actions">
        <button
          type="button"
          className="cancel-btn btn-press"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="submit-btn btn-press"
          disabled={loading}
        >
          <span className="material-symbols-outlined">
            {loading ? "progress_activity" : isEdit ? "check_circle" : "add_circle"}
          </span>
          <span>
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Teacher"
              : "Create Teacher"}
          </span>
        </button>
      </div>
    </form>
  );
}

export default TeacherForm;