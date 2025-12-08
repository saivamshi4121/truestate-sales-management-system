import './FilterPanel.css'

/**
 * FilterPanel Component
 * Displays filter controls for sales data
 * @param {Object} props - Filter state and setters
 */
function FilterPanel({
  gender,
  setGender,
  region,
  setRegion,
  minAge,
  setMinAge,
  maxAge,
  setMaxAge,
  category,
  setCategory,
  payment,
  setPayment,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) {
  return (
    <div className="filter-panel">
      <h3 className="filter-panel-title">Filters</h3>
      <div className="filter-grid">
        {/* Gender Filter */}
        <div className="filter-item">
          <label htmlFor="gender-filter">Gender</label>
          <select
            id="gender-filter"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Region Filter */}
        <div className="filter-item">
          <label htmlFor="region-filter">Region</label>
          <select
            id="region-filter"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">All</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
        </div>

        {/* Min Age Filter */}
        <div className="filter-item">
          <label htmlFor="min-age-filter">Min Age</label>
          <input
            id="min-age-filter"
            type="number"
            min="0"
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
            placeholder="Min"
          />
        </div>

        {/* Max Age Filter */}
        <div className="filter-item">
          <label htmlFor="max-age-filter">Max Age</label>
          <input
            id="max-age-filter"
            type="number"
            min="0"
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            placeholder="Max"
          />
        </div>

        {/* Product Category Filter */}
        <div className="filter-item">
          <label htmlFor="category-filter">Product Category</label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Grocery">Grocery</option>
            <option value="Beauty">Beauty</option>
          </select>
        </div>

        {/* Payment Method Filter */}
        <div className="filter-item">
          <label htmlFor="payment-filter">Payment Method</label>
          <select
            id="payment-filter"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          >
            <option value="">All</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        {/* Start Date Filter */}
        <div className="filter-item">
          <label htmlFor="start-date-filter">Start Date</label>
          <input
            id="start-date-filter"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date Filter */}
        <div className="filter-item">
          <label htmlFor="end-date-filter">End Date</label>
          <input
            id="end-date-filter"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default FilterPanel


