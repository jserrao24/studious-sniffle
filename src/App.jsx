import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import AdminLogin from './AdminLogin';
import Archive from './Archive'; // 💡 IMPORT THE NEW FILE
import './App.css'; 

function App() {
  const [pdfs, setPdfs] = useState([]);
  const [activePdfUrl, setActivePdfUrl] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // 1. Fetch PDFs from your live Render server
    fetch('https://studious-sniffle-x0lh.onrender.com/api/pdfs')
      .then(res => res.json())
      .then(data => {
        setPdfs(data);
        if (data.length > 0) setActivePdfUrl(data[0].url);
      })
      .catch(err => console.error("Error fetching PDFs:", err));

    // 2. Fetch Announcements from your live Render database
    fetch('https://studious-sniffle-x0lh.onrender.com/api/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data))
      .catch(err => console.error("Error fetching announcements:", err));
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home activePdfUrl={activePdfUrl} announcements={announcements} />} />
          
          {/* 💡 ADD THE ARCHIVE ROUTE */}
          <Route path="/archive" element={<Archive announcements={announcements} />} />
          
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
