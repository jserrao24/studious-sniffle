import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; 

function Home({ activePdfUrl, announcements }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* Header section */}
      <div className="page-header">
        <h1>1OFP Updates</h1>
        <p className="small">Optimized for unclassified mission support information.</p>
        <Link to="/admin" className="app-link">
          Admin Login &rarr;
        </Link>
      </div>

      {/* Main Content Area (Vertically Stacked) */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1, 
        width: '95%', 
        maxWidth: '1200px', 
        margin: '20px auto', 
        gap: '20px', 
        overflow: 'hidden'
      }}>
        
        {/* Top Section: Announcements */}
        {announcements.length > 0 && (
          <div style={{ 
            maxHeight: '30vh', 
            overflowY: 'auto', 
            paddingRight: '10px' 
          }}>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 10px 0', borderBottom: '2px solid #dee2e6', paddingBottom: '8px' }}>
              📢 Latest Posts
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {announcements.map((post) => (
                <div key={post.id} style={{
                  backgroundColor: '#ffffff', border: '1px solid #dee2e6',
                  borderRadius: '6px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#6c757d', fontWeight: 'bold' }}>{post.date}</span>
                  <h3 style={{ margin: '5px 0 10px 0', fontSize: '1.05rem', color: '#282c34' }}>{post.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4', color: '#495057' }}>{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {announcements.length === 0 && (
          <div style={{textAlign: 'center'}}>
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No new announcements.</p>
          </div>
        )}

        {/* Bottom Section: PDF Viewer & Controls */}
        <div style={{ 
          flex: 1, 
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #dee2e6', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
          backgroundColor: '#ffffff',
          minHeight: '400px' 
        }}>
          
          {/* PDF Control Bar (New!) */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '10px 15px', 
            backgroundColor: '#f8f9fa', 
            borderBottom: '1px solid #dee2e6' 
          }}>
            <span style={{ fontWeight: 'bold', color: '#495057' }}>📄 Active Document Viewer</span>
            
            {/* Download Button */}
            {activePdfUrl && (
              <a 
                href={activePdfUrl} 
                download 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,123,255,0.2)'
                }}
              >
                ⬇️
              </a>
            )}
          </div>

          {/* iframe Viewer */}
          <iframe 
            src={activePdfUrl || ""}
            title="PDF Viewer"
            width="100%" 
            height="100%" 
            style={{ flex: 1, border: 'none', display: 'block' }}
          />
        </div>

      </div>
    </div>
  );
}

export default Home;
