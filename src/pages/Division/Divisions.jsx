/* eslint-disable */
import { useEffect, useState, useCallback } from "react";
import { getDivisions } from "../../services/DivisionService";
import DivisionTable from "./DivisionTable";
import DivisionModal from "./DivisionModel";
import EditDivisionModal from "./EditDivisionModel";
import Pagination from "../../components/common/pagination/Pagination";
import Loader from "../../components/common/Loader/Loader";
import { getApiErrorMessage } from "../../services/api";

import "./Division.css";

function Division() {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const divisionsPerPage = 5;

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const loadDivisions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDivisions();
      const list = res.data?.divisions || res.divisions || res.data || [];
      setDivisions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load divisions:", err);
      setError(getApiErrorMessage(err, "Failed to load division records from server."));
      setDivisions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDivisions();
  }, [loadDivisions]);

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

  const lastDivisionIndex = currentPage * divisionsPerPage;
  const firstDivisionIndex = lastDivisionIndex - divisionsPerPage;
  const currentDivisions = filteredDivisions.slice(firstDivisionIndex, lastDivisionIndex);
  const totalPages = Math.ceil(filteredDivisions.length / divisionsPerPage) || 1;

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

      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", padding: "16px", borderRadius: "8px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{error}</span>
          <button type="button" onClick={loadDivisions} style={{ background: "rgba(239, 68, 68, 0.3)", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="loading-state" style={{ padding: "60px 0", textAlign: "center" }}>
          <Loader size="medium" text="Loading divisions..." />
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
            <div style={{ marginTop: "16px" }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
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