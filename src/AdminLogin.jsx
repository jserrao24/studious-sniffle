import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin({ pdfs, setPdfs, activePdfUrl, setActivePdfUrl }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const TEST_USERNAME = "admin";
  const TEST_PASSWORD = "admin"; 

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (username === TEST_USERNAME && password === TEST_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      setErrorMsg('❌ Invalid username or password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // 📂 File Management Functions
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const newPdf = {
        id: Date.now(), // Unique ID
        name: file.name,
        url: URL.createObjectURL(file) // Creates a temporary local URL for the iframe
      };
      setPdfs([...pdfs, newPdf]);
      setActivePdfUrl(newPdf.url); // Automatically set new upload as active
    } else {
      alert("Please upload a valid PDF file.");
    }
    // Clear the input after upload
    e.target.value = null; 
  };

  const handleDelete = (idToRemove) => {
    const updatedPdfs = pdfs.filter(pdf => pdf.id !== idToRemove);
    setPdfs(updatedPdfs);
    
    // If we deleted the active PDF, clear the viewer or set it to the first available
    if (pdfs.find(pdf => pdf.id === idToRemove)?.url === activePdfUrl) {
      setActivePdfUrl(updatedPdfs.length > 0 ? updatedPdfs[0].url : "");
    }
  };

  // --- ADMIN DASHBOARD ---
  if (isLoggedIn) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif' }}>
        
        {/* Header & Logout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2>🛡️ Admin Control Panel</h2>
          <div>
            <button onClick={() => navigate('/')} style={{ marginRight: '10px', padding: '8px 15px' }}>View Home Page</button>
            <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Log Out</button>
          </div>
        </div>

        {/* PDF Repository Section */}
        <div style={{ padding: '20px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0 }}>📄 PDF Repository Manager</h3>
          
          {/* Upload New File */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '6px' }}>
            <strong>Upload New PDF:</strong>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} style={{ marginLeft: '10px' }} />
          </div>

          {/* File List Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '10px' }}>File Name</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pdfs.map((pdf) => (
                <tr key={pdf.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '10px' }}>{pdf.name}</td>
                  <td style={{ padding: '10px' }}>
                    {activePdfUrl === pdf.url 
                      ? <span style={{ color: '#28a745', fontWeight: 'bold' }}>Active on Home</span> 
                      : <span style={{ color: '#6c757d' }}>Inactive</span>}
                  </td>
                  <td style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                    <button 
                      disabled={activePdfUrl === pdf.url}
                      onClick={() => setActivePdfUrl(pdf.url)}
                      style={{ padding: '5px 10px', cursor: activePdfUrl === pdf.url ? 'not-allowed' : 'pointer' }}
                    >
                      Set Active
                    </button>
                    <button 
                      onClick={() => handleDelete(pdf.id)}
                      style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {pdfs.length === 0 && (
                <tr><td colSpan="3" style={{ padding: '15px', textAlign: 'center', color: '#6c757d' }}>No PDFs in repository.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  return (
    // ... [Keep your existing login screen return code here]
    <div style={{ maxWidth: '350px', margin: '100px auto', padding: '30px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Login</h2>
      
      {errorMsg && (
        <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold' }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
