import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/authContext';
import { db, storage } from './firebase/firebase'; // Import Firestore and Storage
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'; // Import Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Storage functions
import { Link } from 'react-router-dom';
import './css/File.css';
import './css/styles.css';
import Home from './Home';

function ProjectDetails() {
  const { projectId } = useParams();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const openNav = () => {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  };

  const closeNav = () => {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) {
        const projectRef = doc(db, 'projects', projectId);
        const projectDoc = await getDoc(projectRef);
        if (projectDoc.exists()) {
          setProject({ id: projectDoc.id, ...projectDoc.data() });
        }
      }
    };

    fetchProject();
  }, [projectId]);

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      const fileRef = ref(storage, `projects/${projectId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);

      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        files: arrayUnion({ name: file.name, url: fileURL })
      });

      setMessage(`File "${file.name}" uploaded successfully`);
      setFile(null);
    } catch (error) {
      setMessage(`Failed to upload file: ${error.message}`);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navdiv">
          <div id="mySidebar" className="sidebar">
            <a href="#" className="closebtn" onClick={closeNav}>×</a>
            <Link to="/Invitations">Invitations</Link>
            <Link to="/Projects">Projects</Link>
            <Link to="/Settings">Settings</Link>
          </div>
          <div id="main">
            <button className="openbtn" onClick={openNav}>☰</button>
          </div>
          <div className="logo">
            <Link to="/">
              <img src="/assets/pfp-update.png" alt="Bit Store Logo" height="100px" />
            </Link>
          </div>
        </div>
      </nav>
      {project ? (
        <>
          <h2>{project.projectName}</h2>
          <div>
            <h3>Files</h3>
            {project.files && project.files.length > 0 ? (
              <ul>
                {project.files.map((file, index) => (
                  <div className="FileDiv"><li key={index}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                  </li></div>
                ))}
              </ul>
            ) : (
              <p>No files uploaded yet.</p>
            )}
          </div>
          <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleFileUpload}>Upload File</button>
          </div>
          {message && <p>{message}</p>}
        </>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
}

export default ProjectDetails;