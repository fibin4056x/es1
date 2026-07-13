function ClassToolbar({
  onAdd,
  search,
  setSearch,
}) {
  return (
    <div className="class-toolbar">

      <h2>Classes</h2>

      <div className="class-toolbar-actions">

        <input
          type="text"
          placeholder="Search class..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <button onClick={onAdd}>
          + Add Class
        </button>

      </div>

    </div>
  );
}

export default ClassToolbar;