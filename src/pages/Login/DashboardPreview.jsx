import "./DashboardPreview.css";

function DashboardPreview() {
  return (
    <div className="dashboard-preview">

      <aside className="preview-sidebar">

        <div className="preview-logo"></div>

        <div className="sidebar-item active"></div>

        <div className="sidebar-item"></div>

        <div className="sidebar-item"></div>

        <div className="sidebar-item"></div>

        <div className="sidebar-item"></div>

      </aside>

      <section className="preview-content">

        <header className="preview-navbar">

          <div className="nav-search"></div>

          <div className="nav-avatar"></div>

        </header>

        <div className="preview-cards">

          <div className="card"></div>

          <div className="card"></div>

          <div className="card"></div>

        </div>

        <div className="preview-table">

          <div className="table-header"></div>

          <div className="table-row"></div>

          <div className="table-row"></div>

          <div className="table-row"></div>

          <div className="table-row"></div>

        </div>

      </section>

    </div>
  );
}

export default DashboardPreview;