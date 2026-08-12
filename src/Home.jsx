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

      {/* Main Content Area (Now stacked vertically) */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', // Changed from 'row' to 'column'
        flex: 1, 
        width: '95%', 
        maxWidth: '1200px', // Adjusted max-width for a single column view
        margin: '20px auto', 
        gap: '20px', 
        overflow: 'hidden'
      }}>
        
        {/* Top Section: Announcements */}
        {announcements.length > 0 && (
          <div style={{ 
            // Removed flex: '1' and maxWidth
            maxHeight: '30vh', // Constrains the announcement section height
            overflowY: 'auto', // Allows announcements to scroll if they overflow
            paddingRight: '10px' // Keeps a bit of space for the scrollbar
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

        {/* Bottom Section: PDF Viewer */}
        <div style={{ 
          flex: 1, // Changed from flex: '3' to flex: 1 to fill remaining vertical space
          border: '1px solid #dee2e6', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
          backgroundColor: '#ffffff',
          minHeight: '400px' // Ensures viewer has a minimum height
        }}>
          <iframe 
            src={activePdfUrl || ""}
            title="PDF Viewer"
            width="100%" height="100%" 
            style={{ border: 'none', display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
