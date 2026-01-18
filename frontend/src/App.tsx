import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PortProvider from './contexts/PortContext.tsx';
import HomePage from './components/HomePage.tsx';


function App() {

  return (
    <PortProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </PortProvider>
  )
}

export default App
