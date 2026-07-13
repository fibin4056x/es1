import { toast } from "react-toastify";

import {
  deleteClass,
} from "../../services/classService";

function ClassRow({
  classData,
  reload,
  onEdit,
}) {
  const handleDelete = async () => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this class?"
      );

    if (!confirmDelete) return;

    try {

      await deleteClass(
        classData._id
      );

      toast.success(
        "Class deleted successfully"
      );

      reload();

    } catch (error) {

      console.log(error);

      toast.error(
        "Unable to delete class"
      );

    }

  };

  return (

    <tr>

      <td>{classData.name}</td>

      <td>{classData.academicYear}</td>

      <td>{classData.status}</td>

      <td>

        <button
          onClick={() =>
            onEdit(classData)
          }
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

export default ClassRow;