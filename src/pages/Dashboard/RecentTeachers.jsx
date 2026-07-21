import { useNavigate } from "react-router-dom";
import "./RecentTeachers.css";

function RecentTeachers({ teachers = [] }) {
  const navigate = useNavigate();

  return (
    <div className="glass-card recent-teachers-card">
      {/* Header */}
      <div className="recent-teachers-header">
        <h4 className="recent-teachers-title">
          Recent Teachers
        </h4>

        <button
          type="button"
          className="recent-teachers-see-all btn-press"
          onClick={() => navigate("/teachers")}
        >
          See All
        </button>
      </div>

      {/* Empty State */}
      {teachers.length === 0 ? (
        <div className="teachers-empty-state">
          <span className="material-symbols-outlined">
            school
          </span>

          <p>No teachers available.</p>
        </div>
      ) : (
        <div className="teachers-list-container">
          {teachers.map((teacher) => {
            const isActive =
              (teacher.status || "ACTIVE")
                .toLowerCase() === "active";

            return (
              <div
                key={teacher._id}
                className="teacher-item-row"
                onClick={() => navigate("/teachers")}
              >
                {/* Avatar */}
                <div className="teacher-avatar-box">
                  <img
                    className="teacher-avatar-img"
                    src={
                      teacher.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        teacher.name || "Teacher"
                      )}`
                    }
                    alt={teacher.name}
                  />
                </div>

                {/* Info */}
                <div className="teacher-info-box">
                  <p className="teacher-name-label">
                    {teacher.name}
                  </p>

                  <p className="teacher-subject-label">
                    {teacher.subject || teacher.email}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`teacher-badge-chip ${
                    isActive
                      ? "badge-active"
                      : "badge-inactive"
                  }`}
                >
                  {(teacher.status || "ACTIVE").toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <button
        type="button"
        className="onboard-faculty-dashed-btn btn-press"
        onClick={() => navigate("/teachers")}
      >
        <span className="material-symbols-outlined">
          add
        </span>

        <span>Onboard Faculty</span>
      </button>
    </div>
  );
}

export default RecentTeachers;