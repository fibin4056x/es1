import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createTeacher,
  updateTeacher,
} from "../../services/teacherService";

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

  useEffect(() => {
    if (isEdit && teacher) {
      setForm({
        name: teacher.name || "",
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
      className="obsidian-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="form-group">
        <label htmlFor="teacher-name">
          Teacher Name
        </label>

        <input
          id="teacher-name"
          type="text"
          name="name"
          placeholder="e.g. Eleanor Vance"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="teacher-email">
          Email Address
        </label>

        <input
          id="teacher-email"
          type="email"
          name="email"
          placeholder="e.g. teacher@school.edu"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="teacher-password">
          {isEdit
            ? "Password (Leave blank to keep current password)"
            : "Password"}
        </label>

        <input
          id="teacher-password"
          type="password"
          name="password"
          placeholder={
            isEdit
              ? "Leave blank to keep current password"
              : "Enter password"
          }
          autoComplete={
            isEdit ? "new-password" : "current-password"
          }
          value={form.password}
          onChange={handleChange}
          required={!isEdit}
          disabled={loading}
        />
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="cancel-btn"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : isEdit
            ? "Update Teacher"
            : "Create Teacher"}
        </button>
      </div>
    </form>
  );
}

export default TeacherForm;