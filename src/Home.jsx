import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Our Website</h1>
      <p>This is the public home page accessible to everyone.</p>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/admin" style={{ textDecoration: 'none', color: '#007bff' }}>
          Admin Login &rarr;
        </Link>
      </div>
    </div>
  );
}

export default Home
