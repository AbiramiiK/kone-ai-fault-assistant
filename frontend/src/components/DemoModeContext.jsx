import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const DemoModeContext = createContext(null)

export function DemoModeProvider({ children }) {
  const [active, setActive] = useState(false)
  const navigate = useNavigate()

  const startDemo = useCallback(() => {
    setActive(true)
    navigate('/diagnostics/KONE-E204?demo=1')
  }, [navigate])

  const endDemo = useCallback(() => setActive(false), [])

  return (
    <DemoModeContext.Provider value={{ active, startDemo, endDemo }}>
      {children}
    </DemoModeContext.Provider>
  )
}

export function useDemoMode() {
  const ctx = useContext(DemoModeContext)
  if (!ctx) throw new Error('useDemoMode must be used within DemoModeProvider')
  return ctx
}
