function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginTop: "20px",
      }}
    >
      <button
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage(currentPage - 1)
        }
      >
        Previous
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
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