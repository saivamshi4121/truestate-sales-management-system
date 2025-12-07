import './SortDropdown.css'

/**
 * SortDropdown Component
 * Dropdown for sorting sales data
 * @param {Object} props
 * @param {string} props.sortBy - Current sort value
 * @param {Function} props.setSortBy - Callback to update sort value
 */
function SortDropdown({ sortBy, setSortBy }) {
  return (
    <div className="sort-dropdown-container">
      <select
        className="sort-dropdown"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="">Sort by</option>
        <option value="date">Newest First</option>
        <option value="quantity">Quantity</option>
        <option value="customer_name">Customer Name (A–Z)</option>
      </select>
    </div>
  )
}

export default SortDropdown

