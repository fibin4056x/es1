import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";

import {
  createDivision,
  updateDivision,
} from "../../services/DivisionService";

import { getClasses } from "../../services/ClassService";
import { getTeachers } from "../../services/TeacherService";

import "./DivisionForm.css";
import reactSelectStyles from "../../styles/reactSelectStyles";

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
    let isMounted = true;
    const loadDropdowns = async () => {
      try {
        const classRes = await getClasses();
        const teacherRes = await getTeachers();
        if (isMounted) {
          setClasses(classRes.data || []);
          setTeachers(teacherRes.data || []);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          toast.error("Failed to load classes or teachers.");
        }
      }
    };
    Promise.resolve().then(loadDropdowns);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isEdit && division) {
      Promise.resolve().then(() => {
        setForm({
          name: division.name || "",
          classId: division.classId?._id || division.classId || "",
          assignedTeacher: division.assignedTeacher?._id || division.assignedTeacher || "",
          capacity: division.capacity || 40,
          status: division.status || "active",
        });
      });
    }
  }, [division, isEdit]);


  const classOptions = classes.map((singleClass) => ({
    value: singleClass._id,
    label: singleClass.name,
  }));

  const teacherOptions = [
    {
      value: "",
      label: "Not Assigned",
    },
    ...teachers.map((teacher) => ({
      value: teacher._id,
      label: teacher.name,
    })),
  ];

  const statusOptions = [
    {
      value: "active",
      label: "Active",
    },
    {
      value: "inactive",
      label: "Inactive",
    },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateDivision(division._id, form);
        toast.success("Division updated successfully");
      } else {
        await createDivision(form);
        toast.success("Division created successfully");
      }

      reload();
      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <form
      className="division-form division-form-grid"
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label>Division Name</label>

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
        <label>Class</label>

        <Select
          options={classOptions}
          styles={reactSelectStyles()}
          placeholder="Select Class"
          value={
            classOptions.find(
              (option) => option.value === form.classId
            ) || null
          }
          onChange={(selected) =>
            setForm({
              ...form,
              classId: selected?.value || "",
            })
          }
        />
      </div>

      <div className="form-group">
        <label>Class Teacher</label>

        <Select
          options={teacherOptions}
          styles={reactSelectStyles()}
          placeholder="Select Teacher"
          value={
            teacherOptions.find(
              (option) =>
                option.value === form.assignedTeacher
            ) || teacherOptions[0]
          }
          onChange={(selected) =>
            setForm({
              ...form,
              assignedTeacher: selected?.value || "",
            })
          }
        />
      </div>

      <div className="form-group">
        <label>Capacity</label>

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
        <label>Status</label>

        <Select
          options={statusOptions}
          styles={reactSelectStyles()}
          value={statusOptions.find(
            (option) => option.value === form.status
          )}
          onChange={(selected) =>
            setForm({
              ...form,
              status: selected.value,
            })
          }
        />
      </div>

      <div className="division-form-actions modal-actions">
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
          {isEdit
            ? "Update Division"
            : "Save Division"}
        </button>
      </div>
    </form>
  );
}

export default DivisionForm;