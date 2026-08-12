import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Archive({ announcements }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* Header section */}
      <div className="page-header">
        <h1>Announcements Archive</h1>
        <p className="small">Full registry of all past operational updates.</p>
        <Link to="/" className="app-link">
          &larr; Back to Home
        </Link>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        width: '95%', 
        maxWidth: '900px', 
        margin: '40px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        
        {announcements.length > 0 ? (
          announcements.map((post) => (
            <div key={post.id} style={{
              backgroundColor: '#ffffff', border: '1px solid #dee2e6',
              borderRadius: '6px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#6c757d', fontWeight: 'bold' }}>{post.date}</span>
              <h3 style={{ margin: '8px 0 12px 0', fontSize: '1.15rem', color: '#282c34' }}>{post.title}</h3>
              <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.6', color: '#495057' }}>{post.content}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>No historical announcements found.</p>
        )}

      </div>
    </div>
  );
}

export default Archive;
