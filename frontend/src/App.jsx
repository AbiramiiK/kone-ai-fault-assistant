import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { DemoModeProvider } from './components/DemoModeContext'
import Overview from './pages/Overview'
import Elevators from './pages/Elevators'
import Diagnostics from './pages/Diagnostics'
import FaultHistory from './pages/FaultHistory'
import Reports from './pages/Reports'

function App() {
  return (
    <DemoModeProvider>
      <div className="flex min-h-screen bg-base-950">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/elevators" element={<Elevators />} />
          <Route path="/diagnostics/:elevatorId" element={<Diagnostics />} />
          <Route path="/fault-history" element={<FaultHistory />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </DemoModeProvider>
  )
}

export default App
