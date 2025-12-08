import './Pagination.css'

/**
 * Pagination Component
 * Displays pagination controls for navigating through pages
 * @param {Object} props
 * @param {number} props.page - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onNext - Callback for next button click
 * @param {Function} props.onPrev - Callback for previous button click
 */
function Pagination({ page, totalPages, onNext, onPrev }) {
  const isFirstPage = page === 1
  const isLastPage = page === totalPages

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={onPrev}
        disabled={isFirstPage}
        aria-label="Previous page"
      >
        Previous
      </button>
      
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      
      <button
        className="pagination-button"
        onClick={onNext}
        disabled={isLastPage}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination


