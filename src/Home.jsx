import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css'; 

function Home({ activePdfUrl }) {
  
  // Mock data representing announcement posts
  const [announcements] = useState([
    {
      id: 1,
      date: "Aug 5, 2026",
      title: "🛠️ Scheduled Maintenance",
      content: "The main portal database will undergo standard maintenance this Saturday from 0200 to 0400 HST. Please save any pending work beforehand."
    },
    {
      id: 2,
      date: "Jul 28, 2026",
      title: "📋 New PDF Standards",
      content: "All uploaded operational logs must now adhere to the revised FY26 unclassified template format. Contact your site admin for the latest template."
    }
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* Header section */}
      <div className="page-header">
        <h1>Welcome to Our Website <span className="heart">&hearts;</span></h1>
        <p className="small">Optimized for unclassified mission support information.</p>
        <Link to="/admin" className="app-link">
          Admin Login &rarr;
        </Link>
      </div>

      {/* Two-Column Main Content Layout */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flex: 1, 
        width: '95%', 
        maxWidth: '1400px', 
        margin: '20px auto', 
        gap: '20px',
        overflow: 'hidden' /* Prevents outer scrollbars on the main page */
      }}>
        
        {/* Left Column: 1/4 Width (Announcements) */}
        <div style={{ 
          flex: '1', /* Automatically takes up 25% when paired with 3 on the sibling */
          maxWidth: '350px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          overflowY: 'auto', /* Allows scrolling if there are many announcements */
          paddingRight: '5px'
        }}>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 10px 0', borderBottom: '2px solid #dee2e6', paddingBottom: '8px' }}>
            📢 Latest Posts
          </h2>
          
          {announcements.map((post) => (
            <div key={post.id} style={{
              backgroundColor: '#ffffff',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              padding: '15px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#6c757d', fontWeight: 'bold' }}>{post.date}</span>
              <h3 style={{ margin: '5px 0 10px 0', fontSize: '1.05rem', color: '#282c34' }}>{post.title}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4', color: '#495057' }}>{post.content}</p>
            </div>
          ))}
        </div>

        {/* Right Column: 3/4 Width (PDF Viewer) */}
        <div style={{ 
          flex: '3', /* Takes up the remaining 75% of the space */
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          backgroundColor: '#ffffff'
        }}>
  <iframe 
  src={activePdfUrl} // Use the dynamic prop here!
  title="PDF Viewer"
  width="100%" 
  height="100%" 
  style={{ border: 'none', display: 'block' }}
/>
        </div>

      </div>

    </div>
  );
}

export default Home;
