function DivisionToolbar({
  onAdd,
  search,
  setSearch,
}) {
  return (
    <div className="division-toolbar">

      <h2>Divisions</h2>

      <div className="division-toolbar-actions">

        <input
          type="text"
          placeholder="Search division..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button onClick={onAdd}>
          + Add Division
        </button>

      </div>

    </div>
  );
}

export default DivisionToolbar;