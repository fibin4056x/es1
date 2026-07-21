import { useNavigate } from "react-router-dom";

const recentTeachersList = [
  {
    name: "Dr. Julian Vance",
    subject: "Physics",
    status: "VERIFIED",
    badgeType: "primary",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNEdgG4O_CdlKE_3VCyC8tKcSxLpQT0IDApYtDBsqygTf63ieS6SERcEwmGukU06Lt5GEKCq4lrdbl2i2hFzWitkJkPqAMdzxMH9Vqvl-vcbd8xAGGMcesazpvmznTyiipdBGAlXUc3n_TyulDFGLO03QtuCwNbdqfyqqz3cmeiEp45maWmTBUy4wPfgnFhrY8P97TGt6-sJ-u8d9C4Uu6fwq2MZlWtGccKGdrkAX6nawSUjN23V08a6-3CTvV86BVZOQniEWj_ucq",
  },
  {
    name: "Elena Rodriguez",
    subject: "Digital Arts",
    status: "ACTIVE",
    badgeType: "secondary",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtzdqX46zEWahXq_ZfRFB61M2PoRqADquSHcbEjXfcAhDBk-B8xe7w9A8qPgzfY19sepGO9drRZ1L8Dw92ylL3G75JPZu_OlA2BCRe9lccL61PHmUQ2lQiE20gzcN-qWcCC0QXBaLD4AUz96TWPH98Im8dWNqek2W3ucKpYqm8R4HqiY14Aj7nKG9FEuv-PpMCFMxg2CQvMxmhrXQeZ5fRkDYBOZHh7d74mEtH9J2Qt_RUZtVtGUjxDblizp2uXA9lEJh76lrvO9o4",
  },
  {
    name: "Prof. Arthur Wells",
    subject: "History & Ethics",
    status: "VERIFIED",
    badgeType: "primary",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8LEb6CYTNyI3zS2JDCGaExGxXn1daYHXsCqo_wMzmAuk9YUDRHTxJKj3sdd9HIZFmh2QRGJy9b86-ausQLvOKbuPRkLUZrT89JBmKJrD5hV2ucouC8HY-ZjOVVepHx0j-a81QVSUz6RRrWhobvb8zZrCoLRa0XBTq2hwb6aEzFQcDt3RP3IHt9Jdow3amScMHoDL0HQ1UoyZ0oNbXi_PilLsp53a_Z6pijG5XxFsWoub8jagNT1Bis1MnL2Xj8gxhM9b4JzzDzmwU",
  },
];

function RecentTeachers() {
  const navigate = useNavigate();

  return (
    <div className="glass-card" style={{ padding: "32px", display: "flex", flexDirection: "column", height: "100%", textAlign: "left" }}>
      <style>{`
        .teachers-list-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 24px;
          margin-bottom: 24px;
        }
        .teacher-item-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: var(--radius-2xl);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .teacher-item-row:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        .dark .teacher-item-row:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .teacher-avatar-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid var(--border-main);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .teacher-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .teacher-item-row:hover .teacher-avatar-img {
          transform: scale(1.1);
        }
        .teacher-info-box {
          flex: 1;
        }
        .teacher-name-label {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 2px;
        }
        .teacher-subject-label {
          font-size: 12px;
          color: var(--text-muted);
        }
        .teacher-badge-chip {
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 10px;
          font-weight: 700;
        }
        .teacher-badge-chip.badge-primary {
          background: rgba(192, 193, 255, 0.1);
          color: var(--primary);
        }
        .teacher-badge-chip.badge-secondary {
          background: rgba(221, 183, 255, 0.1);
          color: var(--secondary);
        }
        .onboard-faculty-dashed-btn {
          width: 100%;
          margin-top: auto;
          padding: 12px;
          border-radius: var(--radius-xl);
          border: 1px dashed var(--border-main);
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .onboard-faculty-dashed-btn:hover {
          border-color: rgba(192, 193, 255, 0.4);
          color: var(--primary);
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-main)" }}>Recent Teachers</h4>
        <button 
          onClick={() => navigate("/teachers")} 
          style={{ color: "var(--primary)", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
          className="hover:underline"
        >
          See All
        </button>
      </div>

      <div className="teachers-list-container">
        {recentTeachersList.map((teacher, index) => (
          <div 
            key={index} 
            className="teacher-item-row"
            onClick={() => navigate("/teachers")}
          >
            <div className="teacher-avatar-box">
              <img 
                className="teacher-avatar-img" 
                src={teacher.avatar} 
                alt={teacher.name}
              />
            </div>
            <div className="teacher-info-box">
              <p className="teacher-name-label">{teacher.name}</p>
              <p className="teacher-subject-label">{teacher.subject}</p>
            </div>
            <div className={`teacher-badge-chip badge-${teacher.badgeType}`}>
              {teacher.status}
            </div>
          </div>
        ))}
      </div>

      <button 
        className="onboard-faculty-dashed-btn btn-press"
        onClick={() => navigate("/teachers")}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
        <span>Onboard Faculty</span>
      </button>
    </div>
  );
}

export default RecentTeachers;