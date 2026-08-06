import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import AdminLogin from './AdminLogin';
import './App.css'; 

function App() {
  // Global State for the PDF Repository
  const [pdfs, setPdfs] = useState([
    { 
      id: 1, 
      name: 'Default Dummy PDF.pdf', 
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' 
    }
  ]);
  
  // State for which PDF is currently displayed on the Home page
  const [activePdfUrl, setActivePdfUrl] = useState(pdfs[0].url);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Pass the active URL to the Home page */}
          <Route path="/" element={<Home activePdfUrl={activePdfUrl} />} />
          
          {/* Pass the repository management functions to the Admin page */}
          <Route path="/admin" element={
            <AdminLogin 
              pdfs={pdfs} 
              setPdfs={setPdfs} 
              activePdfUrl={activePdfUrl} 
              setActivePdfUrl={setActivePdfUrl} 
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
