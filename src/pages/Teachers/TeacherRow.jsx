import { useState, useLayoutEffect, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import ConfirmModal from "../../components/common/Modal/ConfirmModal";
import { updateTeacherStatus, deleteTeacher } from "../../services/TeacherService";
import { toast } from "react-toastify";
import "./TeacherRow.css";

const STATUS_FLOW = {
  active: "leave",
  leave: "inactive",
  inactive: "active",
};

const DROPDOWN_GAP = 4;

function TeacherRow({
  teacher,
  reload,
  onEdit,
  onViewDetails,
  onAssignClass,
  assignedDivisions = [],
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Derived, deterministic display fields
  const empId = teacher.empId || `EMP-${(teacher._id || "0000").slice(-4).toUpperCase()}`;
  const subject = teacher.subject || "Not Assigned";
  const phone = teacher.phone || "Not Available";

  const assignedStr =
    assignedDivisions.length > 0
      ? assignedDivisions.map((d) => `${d.classId?.name || "Class"} ${d.name}`).join(", ")
      : "Unassigned";

  // Initials for avatar fallback
  const initials = (teacher.name || "T")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const updateMenuPosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    const node = dropdownRef.current;
    if (!rect || !node) return;
    node.style.top = `${rect.bottom + DROPDOWN_GAP}px`;
    node.style.right = `${window.innerWidth - rect.right}px`;
  }, []);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const handleRowClick = useCallback(() => {
    onViewDetails({
      ...teacher,
      empId,
      subject,
      phone,
      assignedStr,
      assignedDivisions,
    });
  }, [onViewDetails, teacher, empId, subject, phone, assignedStr, assignedDivisions]);

  const handleStatusChange = useCallback(
    async (event) => {
      event.stopPropagation();
      closeMenu();
      const nextStatus = STATUS_FLOW[teacher.status] || "active";

      try {
        await updateTeacherStatus(teacher._id, nextStatus);
        toast.success(`Teacher status updated to ${nextStatus}`);
        reload();
      } catch (err) {
        console.error(err);
        toast.error("Unable to update status");
      }
    },
    [teacher.status, teacher._id, reload, closeMenu]
  );

  const handleDeleteClick = useCallback(
    (event) => {
      event.stopPropagation();
      closeMenu();
      setConfirmOpen(true);
    },
    [closeMenu]
  );

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteTeacher(teacher._id);
      toast.success("Teacher deleted successfully");
      setConfirmOpen(false);
      reload();
    } catch (err) {
      console.error(err);
      toast.error("Unable to delete teacher");
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (!isMenuOpen) return;
    updateMenuPosition();
    const raf = requestAnimationFrame(updateMenuPosition);
    return () => cancelAnimationFrame(raf);
  }, [isMenuOpen, updateMenuPosition]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      const clickedTrigger = triggerRef.current?.contains(event.target);
      const clickedDropdown = dropdownRef.current?.contains(event.target);
      if (!clickedTrigger && !clickedDropdown) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    if (!isMenuOpen) return;

    window.addEventListener("scroll", updateMenuPosition, true);
    window.addEventListener("resize", updateMenuPosition);
    return () => {
      window.removeEventListener("scroll", updateMenuPosition, true);
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [isMenuOpen, updateMenuPosition]);

  return (
    <>
      <tr className="teacher-row" onClick={handleRowClick}>
        {/* Teacher Info */}
        <td>
          <div className="teacher-profile">
            {teacher.avatar ? (
              <img className="teacher-avatar" src={teacher.avatar} alt={`${teacher.name} avatar`} />
            ) : (
              <div className="teacher-avatar-fallback">{initials}</div>
            )}

            <div className="teacher-profile-info">
              <span className="teacher-name">{teacher.name}</span>
              <span className="teacher-role">Educator</span>
            </div>
          </div>
        </td>

        {/* Employee ID */}
        <td className="teacher-emp-id">{empId}</td>

        {/* Subject */}
        <td className="teacher-subject">{subject}</td>

        {/* Assigned Class */}
        <td className="teacher-assigned-class">{assignedStr}</td>

        {/* Contact */}
        <td>
          <div className="teacher-contact">
            <span className="teacher-email">{teacher.email || "Not Available"}</span>
            <span className="teacher-phone">{phone}</span>
          </div>
        </td>

        {/* Status */}
        <td>
          <span className={`teacher-badge ${teacher.status || "active"}`}>
            {(teacher.status || "active").toUpperCase()}
          </span>
        </td>

        {/* Actions */}
        <td className="teacher-actions-cell" onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            ref={triggerRef}
            className="teacher-action-btn"
            aria-label="Teacher Actions"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={handleToggleMenu}
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>

          {isMenuOpen &&
            createPortal(
              <div ref={dropdownRef} className="teacher-dropdown" role="menu">
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    handleRowClick();
                  }}
                >
                  <span className="material-symbols-outlined action-icon">visibility</span>
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onEdit(teacher);
                  }}
                >
                  <span className="material-symbols-outlined action-icon">edit</span>
                  Edit Teacher
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onAssignClass(teacher);
                  }}
                >
                  <span className="material-symbols-outlined action-icon">assignment_ind</span>
                  Assign Class
                </button>

                <button type="button" onClick={handleStatusChange}>
                  <span className="material-symbols-outlined action-icon">sync</span>
                  Change Status
                </button>

                <button type="button" className="danger" onClick={handleDeleteClick}>
                  <span className="material-symbols-outlined action-icon">delete</span>
                  Delete Teacher
                </button>
              </div>,
              document.body
            )}
        </td>
      </tr>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Teacher"
        message={`Are you sure you want to delete ${teacher.name}? This action cannot be undone.`}
        confirmText="Delete Teacher"
        loading={loading}
      />
    </>
  );
}

export default TeacherRow;