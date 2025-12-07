import { Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Layout from './components/Layout'
import SalesPage from './pages/SalesPage'
import FullTableView from './pages/FullTableView'

function App() {
  return (
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
  )
}

export default App

