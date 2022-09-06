import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Main from './Main'

import Home  from './components/Dashboard/'
import Dashboard  from './components/Dashboard/dashboard'



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          
        
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);