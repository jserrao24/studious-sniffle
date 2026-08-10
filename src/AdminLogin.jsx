import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin({ pdfs, setPdfs, activePdfUrl, setActivePdfUrl, announcements, setAnnouncements }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [editingAnnId, setEditingAnnId] = useState(null);

  const TEST_USERNAME = "admin";
  const TEST_PASSWORD = "navy123";

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (username === TEST_USERNAME && password === TEST_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      setErrorMsg('❌ Invalid username or password.');
    }
  };

  // 📂 PDF Upload Endpoint
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const formData = new FormData();
      formData.append('pdfFile', file);

      try {
        const response = await fetch('https://studious-sniffle-x0lh.onrender.com/api/pdfs/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const newPdf = await response.json();
          setPdfs([...pdfs, newPdf]);
          setActivePdfUrl(newPdf.url);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
    e.target.value = null;
  };

  // 📂 PDF Delete Endpoint
  const handleDeletePdf = async (idToRemove) => {
    try {
      await fetch(`https://studious-sniffle-x0lh.onrender.com/api/pdfs/${idToRemove}`, {
        method: 'DELETE',
      });

      const updatedPdfs = pdfs.filter(pdf => pdf.id !== idToRemove);
      setPdfs(updatedPdfs);
      if (pdfs.find(pdf => pdf.id === idToRemove)?.url === activePdfUrl) {
        setActivePdfUrl(updatedPdfs.length > 0 ? updatedPdfs[0].url : "");
      }
    } catch (error) {
      console.error("Failed to delete PDF:", error);
    }
  };

  // 📢 Announcement Post Endpoint
  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    if (editingAnnId) {
      // Logic for updating an existing announcement would go here (PUT request)
      // For now, we just update local state and clear the form.
       setAnnouncements(announcements.map(post =>
         post.id === editingAnnId ? { ...post, title: annTitle, content: annContent } : post
       ));
    } else {
      // Create a new announcement
      const newAnnData = {
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        title: annTitle,
        content: annContent
      };

      try {
        const response = await fetch('https://studious-sniffle-x0lh.onrender.com/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAnnData)
        });

        if (response.ok) {
          const savedPost = await response.json();
          setAnnouncements([savedPost, ...announcements]);
        }
      } catch (error) {
        console.error("Failed to save announcement:", error);
      }
    }
    setAnnTitle('');
    setAnnContent('');
    setEditingAnnId(null);
  };
  
    // 📢 Announcement Delete Endpoint
  const handleDeleteAnnouncement = async (idToRemove) => {
    try {
      await fetch(`https://studious-sniffle-x0lh.onrender.com/api/announcements/${idToRemove}`, {
        method: 'DELETE',
      });

      setAnnouncements(announcements.filter(post => post.id !== idToRemove));
      if (editingAnnId === idToRemove) {
        setEditingAnnId(null);
        setAnnTitle('');
        setAnnContent('');
      }
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };


  const handleEditAnnouncement = (post) => {
    setAnnTitle(post.title);
    setAnnContent(post.content);
    setEditingAnnId(post.id);
  };

  const handleCancelEdit = () => {
    setEditingAnnId(null);
    setAnnTitle('');
    setAnnContent('');
  };

  // --- ADMIN DASHBOARD ---
  if (isLoggedIn) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2>🛡️ Admin Control Panel</h2>
          <div>
            <button onClick={() => navigate('/')} style={{ marginRight: '10px', padding: '8px 15px' }}>View Home Page</button>
            <button onClick={() => setIsLoggedIn(false)} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Log Out</button>
          </div>
        </div>

        {/* 1. PDF Repository Section */}
        <div style={{ padding: '20px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#ffffff', marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0 }}>📄 PDF Repository Manager</h3>
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '6px' }}>
            <strong>Upload New PDF:</strong>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} style={{ marginLeft: '10px' }} />
          </div>
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
                    {activePdfUrl === pdf.url ? <span style={{ color: '#28a745', fontWeight: 'bold' }}>Active</span> : <span style={{ color: '#6c757d' }}>Inactive</span>}
                  </td>
                  <td style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                    <button disabled={activePdfUrl === pdf.url} onClick={() => setActivePdfUrl(pdf.url)}>Set Active</button>
                    <button onClick={() => handleDeletePdf(pdf.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Announcement Management Section */}
        <div style={{ padding: '20px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#ffffff' }}>
          <h3 style={{ marginTop: 0 }}>📢 Announcement Manager</h3>
          
          {/* Add / Edit Form */}
          <form onSubmit={handleSaveAnnouncement} style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '6px' }}>
            <h4 style={{ marginTop: 0 }}>{editingAnnId ? "Edit Announcement" : "Draft New Announcement"}</h4>
            <input
              type="text" placeholder="Title (e.g. 🛠️ Maintenance Alert)" required
              value={annTitle} onChange={(e) => setAnnTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
            />
            <textarea
              placeholder="Announcement Content..." required rows="4"
              value={annContent} onChange={(e) => setAnnContent(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <div>
              <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
                {editingAnnId ? "Update Post" : "Publish Post"}
              </button>
              {editingAnnId && (
                <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 15px', background: 'none', border: '1px solid #6c757d', borderRadius: '4px' }}>Cancel Edit</button>
              )}
            </div>
          </form>

          {/* List of Announcements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {announcements.map((post) => (
              <div key={post.id} style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#6c757d', fontWeight: 'bold' }}>{post.date}</span>
                    <h4 style={{ margin: '5px 0' }}>{post.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{post.content}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEditAnnouncement(post)} style={{ padding: '5px 10px' }}>Edit</button>
                    <button onClick={() => handleDeleteAnnouncement(post.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {announcements.length === 0 && <p style={{ color: '#6c757d' }}>No announcements published.</p>}
          </div>
        </div>

      </div>
    );
  }

  // --- LOGIN SCREEN ---
  return (
    <div style={{ maxWidth: '350px', margin: '100px auto', padding: '30px', border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Admin Login</h2>
      {errorMsg && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>{errorMsg}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '10px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
