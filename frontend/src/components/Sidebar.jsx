import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/sidebar.css'

/**
 * Sidebar Component
 * Professional left sidebar with navigation menu
 */
function Sidebar() {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [invoicesOpen, setInvoicesOpen] = useState(false)

  const toggleServices = () => {
    setServicesOpen(!servicesOpen)
  }

  const toggleInvoices = () => {
    setInvoicesOpen(!invoicesOpen)
  }

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="logo-icon">V</div>
        <span className="logo-text">Vault</span>
      </div>

      {/* User Profile Section */}
      <div className="sidebar-user">
        <div className="user-avatar">
          <span>JD</span>
        </div>
        <div className="user-info">
          <div className="user-name">John Doe</div>
          <div className="user-role">Administrator</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item" end>
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </NavLink>

        <NavLink to="/nexus" className="nav-item">
          <span className="nav-icon">🔗</span>
          <span className="nav-text">Nexus</span>
        </NavLink>

        <NavLink to="/intake" className="nav-item">
          <span className="nav-icon">📥</span>
          <span className="nav-text">Intake</span>
        </NavLink>

        {/* Services Collapsible */}
        <div className="nav-section">
          <button
            className={`nav-item nav-toggle ${servicesOpen ? 'open' : ''}`}
            onClick={toggleServices}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Services</span>
            <span className="nav-arrow">{servicesOpen ? '▼' : '▶'}</span>
          </button>
          {servicesOpen && (
            <div className="nav-submenu">
              <NavLink to="/services/pre-active" className="nav-subitem">
                Pre-active
              </NavLink>
              <NavLink to="/services/active" className="nav-subitem">
                Active
              </NavLink>
              <NavLink to="/services/blocked" className="nav-subitem">
                Blocked
              </NavLink>
              <NavLink to="/services/closed" className="nav-subitem">
                Closed
              </NavLink>
            </div>
          )}
        </div>

        {/* Invoices Collapsible */}
        <div className="nav-section">
          <button
            className={`nav-item nav-toggle ${invoicesOpen ? 'open' : ''}`}
            onClick={toggleInvoices}
          >
            <span className="nav-icon">📄</span>
            <span className="nav-text">Invoices</span>
            <span className="nav-arrow">{invoicesOpen ? '▼' : '▶'}</span>
          </button>
          {invoicesOpen && (
            <div className="nav-submenu">
              <NavLink to="/invoices/proforma" className="nav-subitem">
                Proforma Invoices
              </NavLink>
              <NavLink to="/invoices/final" className="nav-subitem">
                Final Invoices
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar

