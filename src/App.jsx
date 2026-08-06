import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import AdminLogin from './AdminLogin';
import './App.css'; 

function App() {
  const [pdfs, setPdfs] = useState([]);
  const [activePdfUrl, setActivePdfUrl] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  // Fetch data from the Node.js backend when the app starts
  useEffect(() => {
    // 1. Fetch PDFs
    fetch('http://localhost:5000/api/pdfs')
      .then(res => res.json())
      .then(data => {
        setPdfs(data);
        if (data.length > 0) setActivePdfUrl(data[0].url);
      })
      .catch(err => console.error("Error fetching PDFs:", err));

    // 2. Fetch Announcements
    fetch('http://localhost:5000/api/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data))
      .catch(err => console.error("Error fetching announcements:", err));
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home activePdfUrl={activePdfUrl} announcements={announcements} />} />
          <Route path="/admin" element={
            <AdminLogin 
              pdfs={pdfs} 
              setPdfs={setPdfs} 
              activePdfUrl={activePdfUrl} 
              setActivePdfUrl={setActivePdfUrl}
              announcements={announcements}
              setAnnouncements={setAnnouncements}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
