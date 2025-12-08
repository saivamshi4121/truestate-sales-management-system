import { Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Sidebar from './components/Sidebar'
import Layout from './components/Layout'
import SalesPage from './pages/SalesPage'
import FullTableView from './pages/FullTableView'

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="app-content">
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <SalesPage />
              </Layout>
            }
          />
          <Route path="/full-table" element={<FullTableView />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

