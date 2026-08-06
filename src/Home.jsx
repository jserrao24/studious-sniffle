import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  // A sample public PDF URL for demonstration purposes.
  // Replace this with the actual path to your PDF file (e.g., "/my-document.pdf" if stored in your public folder)
  const pdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      padding: '20px', 
      boxSizing: 'border-box',
      fontFamily: 'sans-serif'
    }}>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Welcome to Our Website</h1>
        <p>This is the public home page accessible to everyone.</p>
        <Link to="/admin" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
          Admin Login &rarr;
        </Link>
      </div>

      {/* Responsive PDF Viewer Area */}
      <div style={{ 
        flex: 1, /* Tells the container to fill the remaining vertical space */
        width: '100%', 
        maxWidth: '1200px', /* Optional: caps the maximum width on very large screens */
        margin: '0 auto', /* Centers the viewer */
        border: '2px solid #ccc', 
        borderRadius: '8px', 
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
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
