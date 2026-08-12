import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; 

function Home({ activePdfUrl, announcements }) {
  // 💡 Slice the array to only get the 3 most recent posts
  const topAnnouncements = announcements.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* Header section */}
      <div className="page-header">
        <h1>1OFP Updates</h1>
        <p className="small">Optimized for unclassified mission support information.</p>
        <Link to="/admin" className="app-link">
          Admin Login &rarr;
        </Link>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '95%', 
        maxWidth: '1200px', 
        margin: '20px auto 40px auto', // Added bottom margin for spacing
        gap: '30px' 
      }}>
        
        {/* Top Section: Top 3 Announcements */}
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 15px 0', borderBottom: '2px solid #dee2e6', paddingBottom: '8px' }}>
            📢 Latest Posts
          </h2>
          
          {topAnnouncements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {topAnnouncements.map((post) => (
                <div key={post.id} style={{
                  backgroundColor: '#ffffff', border: '1px solid #dee2e6',
                  borderRadius: '6px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  <span style={{ fontSize: '0.85rem', color: '#6c757d', fontWeight: 'bold' }}>{post.date}</span>
                  <h3 style={{ margin: '8px 0 12px 0', fontSize: '1.15rem', color: '#282c34' }}>{post.title}</h3>
                  <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.6', color: '#495057' }}>{post.content}</p>
                </div>
              ))}
            </div>
          ) : (
             <div style={{textAlign: 'center', margin: '20px 0'}}>
               <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No new announcements.</p>
             </div>
          )}

          {/* 💡 Link to Archive Page (only shows if there are more than 3 posts) */}
          {announcements.length > 3 && (
            <div style={{ textAlign: 'center', marginTop: '25px' }}>
              <Link to="/archive" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
                View All Announcements &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Section: Large PDF Viewer */}
        <div style={{ 
          height: '800px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #dee2e6', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
          backgroundColor: '#ffffff'
        }}>
          
          {/* PDF Control Bar */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '12px 20px', 
            backgroundColor: '#e9ecef', 
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
                  padding: '8px 16px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,123,255,0.2)'
                }}
              >
                ⬇️ Download PDF
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
