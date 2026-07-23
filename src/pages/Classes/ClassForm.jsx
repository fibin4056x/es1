import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  createClass,
  updateClass,
} from "../../services/classService";

function ClassForm({
  classData,
  isEdit = false,
  onClose,
  reload,
}) {
  const [form, setForm] = useState({
    name: "",
    academicYear: "",
    status: "active",
  });

  useEffect(() => {
    if (isEdit && classData) {
      setForm({
        name: classData.name || "",
        academicYear:
          classData.academicYear || "",
        status:
          classData.status || "active",
      });
    }
  }, [classData, isEdit]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateClass(
          classData._id,
          form
        );

        toast.success(
          "Class updated successfully"
        );
      } else {
        await createClass(form);

        toast.success(
          "Class created successfully"
        );
      }

      reload();
      onClose();

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }
  };

  return (

    <form
      className="class-form"
      onSubmit={handleSubmit}
    >

      <div className="form-group">

        <label>
          Class Name
        </label>

        <input
          type="text"
          name="name"
          placeholder="Enter Class Name"
          value={form.name}
          onChange={handleChange}
          required
        />

      </div>

      <div className="form-group">

        <label>
          Academic Year
        </label>

        <input
          type="text"
          name="academicYear"
          placeholder="2026-2027"
          value={form.academicYear}
          onChange={handleChange}
          required
        />

      </div>

      <div className="form-group">

        <label>
          Status
        </label>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

        </select>

      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="cancel-btn btn-press"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="submit-btn btn-press"
        >
          {isEdit ? "Update Class" : "Save Class"}
        </button>
      </div>
    </form>

  );

}

export default ClassForm;