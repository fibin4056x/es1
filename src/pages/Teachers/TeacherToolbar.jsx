function TeacherToolbar({
  onAdd,
  search,
  setSearch,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        gap: "15px",
      }}
    >
      <h2>Teachers</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
  setSearch(e.target.value);
  setCurrentPage(1);
}}
        />

        <button onClick={onAdd}>
          + Add Teacher
        </button>
      </div>
    </div>
  );
}

export default TeacherToolbar;