import React from 'react'; 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { enableDebug } from './utils/debug.js'

// Habilitar debug em desenvolvimento
enableDebug();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
