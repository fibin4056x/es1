import { toast } from "react-toastify";

import {
  deleteStudent,
} from "../../services/studentService";

function StudentRow({
  student,
  reload,
  onEdit,
}) {

  const handleDelete = async () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {

      await deleteStudent(student._id);

      toast.success(
        "Student deleted successfully"
      );

      reload();

    } catch (error) {

      console.log(error);

      toast.error(
        "Unable to delete student"
      );

    }

  };

  return (

    <tr>

      <td>{student.admissionNumber}</td>

      <td>{student.nameEnglish}</td>

      <td>
        {student.classId?.name || "-"}
      </td>

      <td>
        {student.divisionId?.name || "-"}
      </td>

      <td>
        {student.status}
      </td>

      <td>

        <button
          onClick={() => onEdit(student)}
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
        >
          Delete
        </button>

      </td>

    </tr>

  );

}

export default StudentRow;