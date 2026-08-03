/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getClasses } from "../../services/classService";
import {
  getDivisions,
  updateDivision,
} from "../../services/divisionService";

function AssignClassModal({
  open,
  onClose,
  teacher,
  reload,
}) {
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [loading, setLoading] = useState(false);

  const loadDropdowns = async () => {
    try {
      setLoading(true);

      const [classRes, divisionRes] = await Promise.all([
        getClasses(),
        getDivisions(),
      ]);

      setClasses(classRes.data || []);
      setDivisions(divisionRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load classes or divisions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setSelectedClassId("");
      setSelectedDivisionId("");
      return;
    }

    loadDropdowns();
  }, [open]);

  const filteredDivisions = useMemo(() => {
    return divisions.filter(
      (division) =>
        division.classId?._id === selectedClassId
    );
  }, [divisions, selectedClassId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDivisionId) {
      toast.warning("Please select a division.");
      return;
    }

    try {
      setLoading(true);

      const division = divisions.find(
        (item) => item._id === selectedDivisionId
      );

      if (!division) {
        throw new Error("Division not found.");
      }

      await updateDivision(selectedDivisionId, {
        name: division.name,
        classId: division.classId?._id || division.classId,
        capacity: division.capacity,
        status: division.status,
        assignedTeacher: teacher._id,
      });

      toast.success(
        `Assigned to ${division.classId?.name} - ${division.name}`
      );

      reload?.();
      onClose?.();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to assign class."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open || !teacher) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-class-title"
    >
      <div
        className="modal obsidian-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="assign-class-title">
            Assign Class to {teacher.name}
          </h2>

          <button
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close Assign Class Modal"
          >
            ✕
          </button>
        </div>

        <form
          className="obsidian-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="assign-class">
              Select Class
            </label>

            <select
              id="assign-class"
              value={selectedClassId}
              disabled={loading}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedDivisionId("");
              }}
              required
            >
              <option value="">
                Choose a Class
              </option>

              {classes.map((cls) => (
                <option
                  key={cls._id}
                  value={cls._id}
                >
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assign-division">
              Select Division
            </label>

            <select
              id="assign-division"
              value={selectedDivisionId}
              disabled={!selectedClassId || loading}
              onChange={(e) =>
                setSelectedDivisionId(e.target.value)
              }
              required
            >
              <option value="">
                Choose a Division
              </option>

              {filteredDivisions.map((division) => (
                <option
                  key={division._id}
                  value={division._id}
                >
                  {division.name}
                  {division.assignedTeacher?.name
                    ? ` (Assigned: ${division.assignedTeacher.name})`
                    : " (Unassigned)"}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={
                loading || !selectedDivisionId
              }
            >
              {loading
                ? "Assigning..."
                : "Assign Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignClassModal;