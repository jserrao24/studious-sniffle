import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Ensure CSS is imported

function Home() {
  const pdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* Header section styled with App.css classes */}
      <div className="page-header">
        <h1>Welcome to Our Website <span className="heart">&hearts;</span></h1>
        <p className="small">Optimized for unclassified mission support information.</p>
        <Link to="/admin" className="app-link">
          Admin Login &rarr;
        </Link>
      </div>

      {/* Responsive PDF Viewer Wrapper */}
      <div className="pdf-container">
        <iframe 
          src={pdfUrl}
          title="PDF Viewer"
          width="100%" 
          height="100%" 
          style={{ border: 'none', display: 'block' }}
        />
      </div>

    </div>
  );
}

export default Home;
