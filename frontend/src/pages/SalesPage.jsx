import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSales } from '../services/salesApi'
import SalesTable from '../components/SalesTable'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import SortDropdown from '../components/SortDropdown'
import Pagination from '../components/Pagination'
import './SalesPage.css'

/**
 * SalesPage Component
 * Main page for displaying sales transactions
 */
function SalesPage() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [gender, setGender] = useState('')
  const [region, setRegion] = useState('')
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [category, setCategory] = useState('')
  const [payment, setPayment] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortBy, setSortBy] = useState('')

  // Debounce search input - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 1000)

    // Cleanup: clear timeout if search changes before 500ms
    return () => {
      clearTimeout(timer)
    }
  }, [search])

  // Reset page to 1 when debouncedSearch, any filter, or sortBy changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, gender, region, minAge, maxAge, category, payment, startDate, endDate, sortBy])

  useEffect(() => {
    const loadSales = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchSales({
          page,
          search: debouncedSearch,
          gender,
          region,
          minAge,
          maxAge,
          product_category: category,
          payment_method: payment,
          startDate,
          endDate,
          sortBy
        })
        setData(response.data || [])
        setTotalPages(response.totalPages || 1)
      } catch (err) {
        console.error('Error loading sales:', err)
        setError('Failed to load sales data. Please try again.')
        setData([])
      } finally {
        setLoading(false)
      }
    }

    loadSales()
  }, [page, debouncedSearch, gender, region, minAge, maxAge, category, payment, startDate, endDate, sortBy])

  const handleNext = () => {
    setPage(prev => prev + 1)
  }

  const handlePrev = () => {
    setPage(prev => prev - 1)
  }

  if (loading) {
    return (
      <div className="sales-page">
        <div className="sales-page-header">
          <h2>Transactions</h2>
          <button
            className="full-table-button"
            onClick={() => navigate('/full-table')}
          >
            Full Table View
          </button>
        </div>
        <div className="loading-state">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="sales-page">
        <div className="sales-page-header">
          <h2>Transactions</h2>
          <button
            className="full-table-button"
            onClick={() => navigate('/full-table')}
          >
            Full Table View
          </button>
        </div>
        <div className="error-state">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="sales-page">
      <div className="sales-page-header">
        <h2>Transactions</h2>
        <button
          className="full-table-button"
          onClick={() => navigate('/full-table')}
        >
          Full Table View
        </button>
      </div>
      <SearchBar value={search} onChange={setSearch} />
      <FilterPanel
        gender={gender}
        setGender={setGender}
        region={region}
        setRegion={setRegion}
        minAge={minAge}
        setMinAge={setMinAge}
        maxAge={maxAge}
        setMaxAge={setMaxAge}
        category={category}
        setCategory={setCategory}
        payment={payment}
        setPayment={setPayment}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      <SalesTable data={data} />
      <Pagination
        page={page}
        totalPages={totalPages}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  )
}

export default SalesPage

