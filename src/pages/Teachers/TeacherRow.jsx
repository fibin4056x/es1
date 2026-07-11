import { updateTeacherStatus, deleteTeacher, } from "../../services/teacherService";
import { toast } from "react-toastify";
function TeacherRow({
  teacher,
  reload,
  onEdit,
}) {

  const toggleStatus = async () => {

    const status =
      teacher.status === "active"
        ? "inactive"
        : "active";

    try {
  await updateTeacherStatus(
    teacher._id,
    status
  );

  toast.success("Teacher status updated");

  reload();
} catch (err) {
  console.log(err);

  toast.error("Unable to update status");
}
}
  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this teacher?"
  );

  if (!confirmDelete) return;

  try {
   await deleteTeacher(teacher._id);

toast.success("Teacher deleted successfully");

reload();
  } catch (err) {
    console.log(err);
toast.error("Unable to delete teacher");
  }
};
  return (

    <tr>

      <td>{teacher.name}</td>

      <td>{teacher.email}</td>

      <td>{teacher.status}</td>
<td>
  <button onClick={() => onEdit(teacher)}>
    Edit
  </button>

  <button onClick={toggleStatus}>
    {teacher.status === "active"
      ? "Deactivate"
      : "Activate"}
  </button>

  <button onClick={handleDelete}>
    Delete
  </button>
</td>

    </tr>

  );

}

export default TeacherRow;
