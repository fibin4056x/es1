const SUBJECT_OPTIONS = [
  "Malayalam",
  "English",
  "Mathematics",
  "Environmental Studies",
  "Arts",
  "Music",
  "Physical Education",
];

const SORT_OPTIONS = [
  { value: "", label: "Sort By" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "email-asc", label: "Email (A–Z)" },
];

function TeacherToolbar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  subjectFilter,
  setSubjectFilter,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="teachers-toolbar">

      {/* Search */}

      <div className="teachers-search-wrapper">
        <span className="material-symbols-outlined">
          search
        </span>

        <input
          type="search"
          className="teachers-search-input"
          placeholder="Search by teacher name or email..."
          value={search}
          autoComplete="off"
          aria-label="Search teachers"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}

      <div className="teachers-filters-group">

        {/* Status */}

        <div className="teachers-select-wrapper">
          <select
            className="teachers-select"
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status: All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="leave">On Leave</option>
          </select>

          <span className="material-symbols-outlined">
            expand_more
          </span>
        </div>

        {/* Subject */}

        <div className="teachers-select-wrapper">
          <select
            className="teachers-select"
            aria-label="Filter by subject"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">Subject: All</option>

            {SUBJECT_OPTIONS.map((subject) => (
              <option
                key={subject}
                value={subject}
              >
                {subject}
              </option>
            ))}
          </select>

          <span className="material-symbols-outlined">
            expand_more
          </span>
        </div>

        {/* Sort */}

        <div className="teachers-select-wrapper">
          <select
            className="teachers-select"
            aria-label="Sort teachers"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <span className="material-symbols-outlined">
            sort
          </span>
        </div>

      </div>
    </div>
  );
}

export default TeacherToolbar;