import { useState, useEffect } from 'react'
import { fetchSales } from '../services/salesApi'
import SalesTable from '../components/SalesTable'
import Pagination from '../components/Pagination'
import './FullTableView.css'

/**
 * FullTableView Component
 * Displays all sales transactions in a table with pagination only
 */
function FullTableView() {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSales = async () => {
      try {
        setLoading(true)
        const response = await fetchSales({ page })
        setData(response.data || [])
        setTotalPages(response.totalPages || 1)
      } catch (err) {
        console.error('Error loading sales:', err)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    loadSales()
  }, [page])

  const handleNext = () => {
    setPage(prev => prev + 1)
  }

  const handlePrev = () => {
    setPage(prev => prev - 1)
  }

  if (loading) {
    return (
      <div className="full-table-view">
        <h2>Full Table View</h2>
        <div className="loading-state">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="full-table-view">
      <h2>Full Table View</h2>
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

export default FullTableView


