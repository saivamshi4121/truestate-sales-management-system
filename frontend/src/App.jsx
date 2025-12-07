import './styles/App.css'
import SalesPage from './pages/SalesPage'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Sales Management System</h1>
      </header>
      <main className="app-main">
        <SalesPage />
      </main>
    </div>
  )
}

export default App

