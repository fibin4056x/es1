function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div className="pagination-container">
      <button
        className="pagination-btn btn-press"
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage(currentPage - 1)
        }
      >
        Previous
      </button>

      <span className="pagination-label">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="pagination-btn btn-press"
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() =>
          setCurrentPage(currentPage + 1)
        }
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;