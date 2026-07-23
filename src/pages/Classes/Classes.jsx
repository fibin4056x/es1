import { useEffect, useState } from "react";

import { getClasses } from "../../services/classService";

import ClassToolbar from "./ClassToolbar";
import ClassTable from "./ClassTable";
import ClassModal from "./ClassModal";
import EditClassModal from "./EditClassModal";
import Pagination from "../../components/common/pagination/Pagination";

import "./Classes.css";

function Classes() {
  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const classesPerPage = 5;

  const [open, setOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);

      const res = await getClasses();

      setClasses(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const filteredClasses = classes.filter(
    (singleClass) =>
      (singleClass.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (singleClass.academicYear || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const lastClassIndex =
    currentPage * classesPerPage;

  const firstClassIndex =
    lastClassIndex - classesPerPage;

  const currentClasses =
    filteredClasses.slice(
      firstClassIndex,
      lastClassIndex
    );

  const totalPages = Math.ceil(
    filteredClasses.length /
      classesPerPage
  );

  return (
    <div className="classes-page animate-fade-in-up">

      <ClassToolbar
        onAdd={() => setOpen(true)}
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
      />

      {loading ? (
        <div className="loading-state">
          <p>Loading classes...</p>
        </div>
      ) : (
        <>
          <div className="glass-card table-card">
            <div className="table-responsive">
              <ClassTable
                classes={currentClasses}
                reload={loadClasses}
                onEdit={(singleClass) => {
                  setSelectedClass(singleClass);
                  setEditOpen(true);
                }}
              />
            </div>
          </div>

          {filteredClasses.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}

      <ClassModal
        open={open}
        onClose={() => setOpen(false)}
        reload={loadClasses}
      />

      <EditClassModal
        open={editOpen}
        classData={selectedClass}
        onClose={() => {
          setEditOpen(false);
          setSelectedClass(null);
        }}
        reload={loadClasses}
      />

    </div>
  );
}

export default Classes;