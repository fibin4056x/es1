import { useEffect, useState } from "react";
import { createTeacher, updateTeacher } from "../../services/teacherService";
import  { toast } from "react-toastify";
function TeacherForm({
  teacher,
  isEdit = false,
  onClose,
  reload,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
  if (isEdit && teacher) {
    setForm({
      name: teacher.name || "",
      email: teacher.email || "",
      password: "",
    });
  }
}, [isEdit, teacher]);

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
      await updateTeacher(teacher._id, form);

      toast.success("Teacher updated successfully");
    } else {
      await createTeacher(form);

      toast.success("Teacher created successfully");
    }

    reload();
    onClose();
  } catch (err) {
    console.log(err);

    toast.error(
      isEdit
        ? "Unable to update teacher"
        : "Unable to create teacher"
    );
  }
};

  return (

    <form onSubmit={handleSubmit}>

      <input
        name="name"
        placeholder="Teacher Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

   <button type="submit">
  {isEdit ? "Update Teacher" : "Save Teacher"}
  </button>

    </form>

  );

}

export default TeacherForm;