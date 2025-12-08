import './Layout.css'

/**
 * Layout Component
 * Wraps pages with header and main content structure
 */
function Layout({ children }) {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Sales Management System</h1>
      </header>
      <main className="app-main">
        {children}
      </main>
    </div>
  )
}

export default Layout


