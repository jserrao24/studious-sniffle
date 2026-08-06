import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add your actual authentication logic here
    console.log('Login attempted with:', { username, password });
    
    // Simulate successful login and redirect to a dashboard (if it existed)
    // navigate('/dashboard'); 
    alert('Login submission simulated. Check console.');
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <button 
        onClick={() => navigate('/')} 
        style={{ marginTop: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
      >
        &larr; Back to Home
      </button>
    </div>
  );
}

export default AdminLogin;
