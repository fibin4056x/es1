import TeacherRow from "./TeacherRow";
import "./Teachertable.css"
function TeacherSkeletonRow() {
  return (
    <tr className="skeleton-row">
      {/* Teacher */}
      <td>
        <div className="teacher-profile">
          <div className="skeleton skeleton-avatar"></div>

          <div className="teacher-profile-info skeleton-profile">
            <div className="skeleton skeleton-name"></div>
            <div className="skeleton skeleton-role"></div>
          </div>
        </div>
      </td>

      {/* Employee ID */}
      <td>
        <div className="skeleton skeleton-emp-id"></div>
      </td>

      {/* Subject */}
      <td>
        <div className="skeleton skeleton-subject"></div>
      </td>

      {/* Assigned Class */}
      <td>
        <div className="skeleton skeleton-class"></div>
      </td>

      {/* Contact */}
      <td>
        <div className="teacher-contact skeleton-contact">
          <div className="skeleton skeleton-email"></div>
          <div className="skeleton skeleton-phone"></div>
        </div>
      </td>

      {/* Status */}
      <td>
        <div className="skeleton skeleton-status"></div>
      </td>

      {/* Actions */}
      <td className="teacher-actions-cell">
        <div className="skeleton skeleton-action"></div>
      </td>
    </tr>
  );
}

function TeacherTable({
  teachers,
  loading,
  reload,
  onEdit,
  onViewDetails,
  onAssignClass,
  assignedDivisionsMap = {},
  onClearFilters,
}) {
  const SKELETON_ROWS = 5;

  return (
    <div className="teachers-table-wrapper">
      <table
        className="teachers-table"
        aria-label="Teachers List"
      >
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Emp ID</th>
            <th>Subject</th>
            <th>Assigned Class</th>
            <th>Contact</th>
            <th>Status</th>
            <th className="teacher-actions-header">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: SKELETON_ROWS }).map((_, index) => (
              <TeacherSkeletonRow
                key={`skeleton-${index}`}
              />
            ))
          ) : teachers.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="teachers-empty-cell"
              >
                <div className="teachers-empty-state">

                  <div className="empty-state-icon-box">
                    <div className="blur-bg"></div>

                    <span className="material-symbols-outlined empty-state-icon">
                      person_off
                    </span>
                  </div>

                  <h3 className="empty-state-title">
                    No Teachers Found
                  </h3>

                  <p className="empty-state-description">
                    There are currently no teacher records
                    matching your search or filters.
                    Try adjusting your filters or create a
                    new teacher to get started.
                  </p>

                  {onClearFilters && (
                    <button
                      type="button"
                      className="clear-filters-btn"
                      onClick={onClearFilters}
                    >
                      <span className="material-symbols-outlined">
                        restart_alt
                      </span>

                      Clear Filters
                    </button>
                  )}

                </div>
              </td>
            </tr>
          ) : (
            teachers.map((teacher) => (
              <TeacherRow
                key={teacher._id}
                teacher={teacher}
                reload={reload}
                onEdit={onEdit}
                onViewDetails={onViewDetails}
                onAssignClass={onAssignClass}
                assignedDivisions={
                  assignedDivisionsMap[teacher._id] || []
                }
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherTable;