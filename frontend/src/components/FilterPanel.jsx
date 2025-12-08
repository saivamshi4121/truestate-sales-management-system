import '../styles/filters.css'

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
  setEndDate,
  sortBy,
  setSortBy
}) {
  return (
    <div className="filter-panel">
      <div className="filter-bar">
        {/* Customer Region Filter */}
        <div className={`filter-field ${region ? 'active' : ''}`}>
          <select
            id="region-filter"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="filter-input"
          >
            <option value="">Customer Region</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div className={`filter-field ${gender ? 'active' : ''}`}>
          <select
            id="gender-filter"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="filter-input"
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Min Age Filter */}
        <div className={`filter-field filter-field-number ${minAge ? 'active' : ''}`}>
          <input
            id="min-age-filter"
            type="number"
            min="0"
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
            placeholder="Min Age"
            className="filter-input"
          />
        </div>

        {/* Max Age Filter */}
        <div className={`filter-field filter-field-number ${maxAge ? 'active' : ''}`}>
          <input
            id="max-age-filter"
            type="number"
            min="0"
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            placeholder="Max Age"
            className="filter-input"
          />
        </div>

        {/* Product Category Filter */}
        <div className={`filter-field ${category ? 'active' : ''}`}>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-input"
          >
            <option value="">Product Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Grocery">Grocery</option>
            <option value="Beauty">Beauty</option>
          </select>
        </div>

        {/* Payment Method Filter */}
        <div className={`filter-field ${payment ? 'active' : ''}`}>
          <select
            id="payment-filter"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="filter-input"
          >
            <option value="">Payment Method</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        {/* Start Date Filter */}
        <div className={`filter-field filter-field-date ${startDate ? 'active' : ''}`}>
          <input
            id="start-date-filter"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="From"
            className="filter-input"
          />
        </div>

        {/* End Date Filter */}
        <div className={`filter-field filter-field-date ${endDate ? 'active' : ''}`}>
          <input
            id="end-date-filter"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="To"
            className="filter-input"
          />
        </div>

        {/* Sort By Filter */}
        <div className={`filter-field ${sortBy ? 'active' : ''}`}>
          <select
            id="sort-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-input"
          >
            <option value="">Sort By</option>
            <option value="date">Newest First</option>
            <option value="quantity">Quantity</option>
            <option value="customer_name">Customer Name (A–Z)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel


