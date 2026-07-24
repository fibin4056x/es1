import "./DivisionToolbar.css";

function DivisionToolbar({
  onAdd,
  search,
  setSearch,
}) {
  return (
    <div className="division-toolbar">

      <div className="division-toolbar-title">
        <h2 className="division-title">
          Divisions
        </h2>
      </div>

      <div className="division-toolbar-actions">

        <input
          className="division-search"
          type="text"
          placeholder="Search division..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          className="division-add-btn btn-press"
          onClick={onAdd}
        >
          <span className="material-symbols-outlined">
            add
          </span>

          <span>Add Division</span>
        </button>

      </div>

    </div>
  );
}

export default DivisionToolbar;