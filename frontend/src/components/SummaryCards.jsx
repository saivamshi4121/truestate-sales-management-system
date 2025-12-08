import { useState, useEffect } from 'react'
import { fetchSalesSummary } from '../services/salesApi'
import '../styles/summaryCards.css'

/**
 * SummaryCards Component
 * Displays summary statistics cards for sales data
 */
function SummaryCards() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchSalesSummary()
        setSummary(data)
      } catch (err) {
        console.error('Error loading summary:', err)
        setError('Failed to load summary data')
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  if (loading) {
    return (
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-value"></div>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-value"></div>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-value"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="summary-cards">
        <div className="summary-card error-card">
          <div className="card-title">Error</div>
          <div className="card-value">{error || 'Unable to load summary data'}</div>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="card-title">Total Units Sold</div>
        <div className="card-value">
          {summary.totalUnits?.toLocaleString('en-IN') || '0'}
        </div>
      </div>
      <div className="summary-card">
        <div className="card-title">Total Amount</div>
        <div className="card-value">
          {formatCurrency(summary.totalAmount)}
        </div>
      </div>
      <div className="summary-card">
        <div className="card-title">Total Discount</div>
        <div className="card-value">
          {formatCurrency(summary.totalDiscount)}
        </div>
      </div>
    </div>
  )
}

export default SummaryCards

