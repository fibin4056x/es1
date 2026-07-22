import { useState, useEffect, useRef } from "react";
import { updateTeacherStatus, deleteTeacher } from "../../services/teacherService";
import { toast } from "react-toastify";
import "./TeacherRow.css"
function TeacherRow({
  teacher,
  reload,
  onEdit,
  onViewDetails,
  onAssignClass,
  assignedDivisions = [],
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Derived deterministic fields

const empId =
  teacher.empId ||
  `EMP-${(teacher._id || "0000").slice(-4).toUpperCase()}`;
  
  // Deterministic subject based on email/id
  
  
  const subject =
  teacher.subject || "Not Assigned";
  
  // Deterministic phone

  const phone =
  teacher.phone || "Not Available";


  // Format assigned classes
  const assignedStr = assignedDivisions.length > 0
    ? assignedDivisions.map(d => `${d.classId?.name || "Class"} ${d.name}`).join(", ")
    : "Unassigned";

  // Cycle status: active -> leave -> inactive -> active
  const handleStatusChange = async (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    
const statusFlow = {
  active: "leave",
  leave: "inactive",
  inactive: "active",
};

const nextStatus =
  statusFlow[teacher.status] || "active";

    try {
      await updateTeacherStatus(teacher._id, nextStatus);
      toast.success(`Teacher status updated to ${nextStatus}`);
      reload();
    } catch (err) {
      console.error(err);
      toast.error("Unable to update status");
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${teacher.name}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteTeacher(teacher._id);
      toast.success("Teacher deleted successfully");
      reload();
    } catch (err) {
      console.error(err);
      toast.error("Unable to delete teacher");
    }
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Initials for avatar fallback
  const initials = (teacher.name || "T")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleRowClick = () => {
    onViewDetails({
      ...teacher,
      empId,
      subject,
      phone,
      assignedStr,
      assignedDivisions
    });
  };

 return (
  <tr className="teacher-row" onClick={handleRowClick}>
    {/* Teacher Info */}
    <td>
      <div className="teacher-profile">
        {teacher.avatar ? (
          <img
            className="teacher-avatar"
            src={teacher.avatar}
            alt={`${teacher.name} avatar`}
          />
        ) : (
          <div className="teacher-avatar-fallback">
            {initials}
          </div>
        )}

        <div className="teacher-profile-info">
          <span className="teacher-name">{teacher.name}</span>
          <span className="teacher-role">Educator</span>
        </div>
      </div>
    </td>

    {/* Employee ID */}
    <td className="teacher-emp-id">
      {empId}
    </td>

    {/* Subject */}
    <td className="teacher-subject">
      {subject}
    </td>

    {/* Assigned Class */}
    <td className="teacher-assigned-class">
      {assignedStr}
    </td>

    {/* Contact */}
    <td>
      <div className="teacher-contact">
        <span className="teacher-email">
          {teacher.email || "Not Available"}
        </span>

        <span className="teacher-phone">
          {phone}
        </span>
      </div>
    </td>

    {/* Status */}
    <td>
      <span
        className={`teacher-badge ${
          teacher.status || "active"
        }`}
      >
        {(teacher.status || "active").toUpperCase()}
      </span>
    </td>

    {/* Actions */}
    <td
      className="teacher-actions-cell"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="teacher-actions-wrapper"
        ref={menuRef}
      >
        <button
          type="button"
          className="teacher-action-btn"
          aria-label="Teacher Actions"
          onClick={() =>
            setIsMenuOpen((prev) => !prev)
          }
        >
          <span className="material-symbols-outlined">
            more_vert
          </span>
        </button>

        {isMenuOpen && (
          <div className="teacher-dropdown">

            <button type="button" onClick={() => {
              setIsMenuOpen(false);
              handleRowClick();
            }}>
              <span className="material-symbols-outlined action-icon">
                visibility
              </span>
              View Details
            </button>

            <button type="button" onClick={() => {
              setIsMenuOpen(false);
              onEdit(teacher);
            }}>
              <span className="material-symbols-outlined action-icon">
                edit
              </span>
              Edit Teacher
            </button>

            <button type="button" onClick={() => {
              setIsMenuOpen(false);
              onAssignClass(teacher);
            }}>
              <span className="material-symbols-outlined action-icon">
                assignment_ind
              </span>
              Assign Class
            </button>

            <button
              type="button"
              onClick={handleStatusChange}
            >
              <span className="material-symbols-outlined action-icon">
                sync
              </span>
              Change Status
            </button>

            <button
              type="button"
              className="danger"
              onClick={handleDelete}
            >
              <span className="material-symbols-outlined action-icon">
                delete
              </span>
              Delete Teacher
            </button>

          </div>
        )}
      </div>
    </td>
  </tr>
);
}

export default TeacherRow;
