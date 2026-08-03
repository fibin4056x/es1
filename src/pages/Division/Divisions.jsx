/* eslint-disable */
import { useEffect, useState } from "react";

import { getDivisions } from "../../services/divisionService";

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

  useEffect(() => {
    loadDivisions();
  }, []);

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
    <div className="divisions-page animate-fade-in-up">

      {/* Divisions Page Header */}
      <div className="divisions-header-row">
        <div className="divisions-title-group">
          <h1>Divisions</h1>
          <p>Manage divisions, classroom capacity, assignments, and status.</p>
        </div>
        <div>
          <button type="button" className="divisions-add-btn btn-press" onClick={() => setOpen(true)}>
            <span className="material-symbols-outlined">add</span>
            Add Division
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="divisions-toolbar">
        <div className="divisions-search-wrapper">
          <span className="material-symbols-outlined">search</span>
          <input
            type="search"
            className="divisions-search-input"
            placeholder="Search divisions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading divisions...</p>
        </div>
      ) : (
        <>
          <div className="glass-card table-card">
            <div className="table-responsive">
              <DivisionTable
                divisions={currentDivisions}
                reload={loadDivisions}
                onEdit={(division) => {
                  setSelectedDivision(division);
                  setEditOpen(true);
                }}
              />
            </div>
          </div>

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