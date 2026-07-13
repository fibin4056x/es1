import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  createDivision,
  updateDivision,
} from "../../services/divisionService";

import {
  getClasses,
} from "../../services/classService";

import {
  getTeachers,
} from "../../services/teacherService";

function DivisionForm({
  division,
  isEdit = false,
  onClose,
  reload,
}) {
  const [classes, setClasses] = useState([]);

  const [teachers, setTeachers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    classId: "",
    assignedTeacher: "",
    capacity: 40,
    status: "active",
  });

  useEffect(() => {
    loadDropdowns();
  }, []);

  useEffect(() => {
    if (isEdit && division) {
      setForm({
        name: division.name || "",
        classId: division.classId?._id || "",
        assignedTeacher:
          division.assignedTeacher?._id || "",
        capacity: division.capacity || 40,
        status: division.status || "active",
      });
    }
  }, [division, isEdit]);

  const loadDropdowns = async () => {
    try {
      const classRes = await getClasses();

      const teacherRes =
        await getTeachers();

      setClasses(classRes.data);

      setTeachers(teacherRes.data);

    } catch (error) {
      console.log(error);
    }
  };

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
        await updateDivision(
          division._id,
          form
        );

        toast.success(
          "Division updated successfully"
        );

      } else {

        await createDivision(form);

        toast.success(
          "Division created successfully"
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
      className="division-form"
      onSubmit={handleSubmit}
    >

      <div className="form-group">

        <label>
          Division Name
        </label>

        <input
          type="text"
          name="name"
          placeholder="A"
          value={form.name}
          onChange={handleChange}
          required
        />

      </div>

      <div className="form-group">

        <label>
          Class
        </label>

        <select
          name="classId"
          value={form.classId}
          onChange={handleChange}
          required
        >

          <option value="">
            Select Class
          </option>

          {classes.map(
            (singleClass) => (

              <option
                key={singleClass._id}
                value={
                  singleClass._id
                }
              >
                {singleClass.name}
              </option>

            )
          )}

        </select>

      </div>

      <div className="form-group">

        <label>
          Class Teacher
        </label>

        <select
          name="assignedTeacher"
          value={form.assignedTeacher}
          onChange={handleChange}
        >

          <option value="">
            Not Assigned
          </option>

          {teachers.map(
            (teacher) => (

              <option
                key={teacher._id}
                value={
                  teacher._id
                }
              >
                {teacher.name}
              </option>

            )
          )}

        </select>

      </div>

      <div className="form-group">

        <label>
          Capacity
        </label>

        <input
          type="number"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          min="1"
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

      <button type="submit">

        {isEdit
          ? "Update Division"
          : "Save Division"}

      </button>

    </form>
  );
}

export default DivisionForm;