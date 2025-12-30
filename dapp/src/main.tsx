import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '3rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      Hello World
    </div>
  </StrictMode>,
)
