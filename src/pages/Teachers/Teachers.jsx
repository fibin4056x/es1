import { useEffect, useState } from "react";
import { getTeachers } from "../../services/teacherService";
import Pagination from "../../components/common/pagination/Pagination";
import TeacherToolbar from "./TeacherToolbar";
import TeacherTable from "./TeacherTable";
import TeacherModal from "./TeacherModal";
import EditTeacherModal from "./EditTeacherModel";
import "./Teachers.css";
function Teachers() {

  const [teachers, setTeachers] = useState([]);
 const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
 const [currentPage, setCurrentPage] = useState(1);

 const teachersPerPage = 5;
  const [open, setOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    loadTeachers();
  }, []);

 const loadTeachers = async () => {
  try {
    setLoading(true);

    const res = await getTeachers();

    setTeachers(res.data);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
   const filteredTeachers = teachers.filter((teacher) =>
  (teacher.name || "")
    .toLowerCase()
    .includes(search.toLowerCase()) || 
  (teacher.email || "")
    .toLowerCase()
    .includes(search.toLowerCase()));

    const lastTeacherIndex = currentPage * teachersPerPage;

const firstTeacherIndex =
  lastTeacherIndex - teachersPerPage;

const currentTeachers =
  filteredTeachers.slice(
    firstTeacherIndex,
    lastTeacherIndex
  );

const totalPages = Math.ceil(
  filteredTeachers.length / teachersPerPage
);

  return (

    <div>

   <TeacherToolbar
  onAdd={() => setOpen(true)}
  search={search}
  setSearch={(value) => {
    setSearch(value);
    setCurrentPage(1);
  }}
/>
{loading ? (
<div className="loading-state">
  <h3>Loading teachers...</h3>
</div>
) : (
  <>
    <TeacherTable
      teachers={currentTeachers}
      reload={loadTeachers}
      onEdit={(teacher) => {
        setSelectedTeacher(teacher);
        setEditOpen(true);
      }}
    />

   {filteredTeachers.length > 0 && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    setCurrentPage={setCurrentPage}
  />
)}
  </>
)}
    
      <TeacherModal
        open={open}
        onClose={() => setOpen(false)}
        reload={loadTeachers}
      />

      <EditTeacherModal
  open={editOpen}
  teacher={selectedTeacher}
  onClose={() => {
    setEditOpen(false);
    setSelectedTeacher(null);
  }}
  reload={loadTeachers}
/>

    </div>

  );

}

export default Teachers;