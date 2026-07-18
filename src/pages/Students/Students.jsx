import { useEffect, useState } from "react";

import { getStudents } from "../../services/studentService";

import StudentToolbar from "./StudentToolbar";
import StudentTable from "./StudentTable";
import StudentModal from "./StudentModal";
import EditStudentModal from "./EditStudentModal";
import Pagination from "../../components/common/pagination/Pagination";
import StudentStats from "./StudentStats";

import "./Students.css";

function Students() {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  const [open, setOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);

      const res = await getStudents();

      setStudents(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      (student.nameEnglish || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (student.admissionNumber || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const lastStudentIndex =
    currentPage * studentsPerPage;

  const firstStudentIndex =
    lastStudentIndex - studentsPerPage;

  const currentStudents =
    filteredStudents.slice(
      firstStudentIndex,
      lastStudentIndex
    );

  const totalPages = Math.ceil(
    filteredStudents.length /
      studentsPerPage
  );

  return (
    <div>

      <StudentToolbar
        onAdd={() => setOpen(true)}
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
      />

      <StudentStats
        students={students}
      />

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <>
          <StudentTable
            students={currentStudents}
            reload={loadStudents}
            onEdit={(student) => {
              setSelectedStudent(student);
              setEditOpen(true);
            }}
          />

          {filteredStudents.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={
                setCurrentPage
              }
            />
          )}
        </>
      )}

      <StudentModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        reload={loadStudents}
      />

      <EditStudentModal
        open={editOpen}
        student={selectedStudent}
        onClose={() => {
          setEditOpen(false);
          setSelectedStudent(null);
        }}
        reload={loadStudents}
      />

    </div>
  );
}

export default Students;