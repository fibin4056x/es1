function StudentToolbar({
  onAdd,
  search,
  setSearch,
}) {
  return (
    <div className="student-toolbar">

      <h2>Students</h2>

      <div className="student-toolbar-actions">

        <input
          type="text"
          placeholder="Search by name or admission number..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button onClick={onAdd}>
          + Add Student
        </button>

      </div>

    </div>
  );
}

export default StudentToolbar;
