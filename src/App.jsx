import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import AdminLogin from './AdminLogin';
import './App.css';

function App() {
  const [pdfs, setPdfs] = useState([]);
  const [activePdfUrl, setActivePdfUrl] = useState('');
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch PDFs from the live Render backend
    fetch('https://studious-sniffle-x0lh.onrender.com/api/pdfs')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`PDF API returned ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('PDFs received:', data);

        setPdfs(data);

        if (data.length > 0) {
          setActivePdfUrl(data[0].url);
          console.log('Active PDF:', data[0].url);
        }
      })
      .catch((err) => {
        console.error('Error fetching PDFs:', err);
      });

    // Fetch announcements from the live Render backend
    fetch('https://studious-sniffle-x0lh.onrender.com/api/announcements')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Announcements API returned ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setAnnouncements(data);
      })
      .catch((err) => {
        console.error('Error fetching announcements:', err);
      });
  }, []);

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            <Home
              activePdfUrl={activePdfUrl}
              announcements={announcements}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminLogin
              pdfs={pdfs}
              setPdfs={setPdfs}
              activePdfUrl={activePdfUrl}
              setActivePdfUrl={setActivePdfUrl}
              announcements={announcements}
              setAnnouncements={setAnnouncements}
            />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;