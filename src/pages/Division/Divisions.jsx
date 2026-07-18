import { useEffect, useState } from "react";

import { getDivisions } from "../../services/divisionService";

import DivisionToolbar from "./DivisionToolbar";
import DivisionTable from "./DivisionTable";
import DivisionModal from "./DivisionModel";
import EditDivisionModal from "./EditDivisionModel";
import Pagination from "../../components/common/pagination/Pagination";

import "./Division.css";

function Division() {
  const [divisions, setDivisions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const divisionsPerPage = 5;

  const [open, setOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [selectedDivision, setSelectedDivision] =
    useState(null);

  useEffect(() => {
    loadDivisions();
  }, []);

  const loadDivisions = async () => {
    try {
      setLoading(true);

      const res = await getDivisions();

      setDivisions(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const filteredDivisions = divisions.filter(
    (division) =>
      (division.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (division.classId?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (division.assignedTeacher?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const lastDivisionIndex =
    currentPage * divisionsPerPage;

  const firstDivisionIndex =
    lastDivisionIndex - divisionsPerPage;

  const currentDivisions =
    filteredDivisions.slice(
      firstDivisionIndex,
      lastDivisionIndex
    );

  const totalPages = Math.ceil(
    filteredDivisions.length /
      divisionsPerPage
  );

  return (
    <div>

      <DivisionToolbar
        onAdd={() => setOpen(true)}
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
      />

      {loading ? (

        <p>Loading divisions...</p>

      ) : (

        <>
          <DivisionTable
            divisions={currentDivisions}
            reload={loadDivisions}
            onEdit={(division) => {
              setSelectedDivision(division);
              setEditOpen(true);
            }}
          />

          {filteredDivisions.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>

      )}

      <DivisionModal
        open={open}
        onClose={() => setOpen(false)}
        reload={loadDivisions}
      />

      <EditDivisionModal
        open={editOpen}
        division={selectedDivision}
        onClose={() => {
          setEditOpen(false);
          setSelectedDivision(null);
        }}
        reload={loadDivisions}
      />

    </div>
  );
}

export default Division;