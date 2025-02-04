import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import { db, storage } from './firebase/firebase'; // Import Firestore and Storage
import { doc, getDoc, updateDoc, deleteDoc, arrayUnion } from 'firebase/firestore'; // Import Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Storage functions
import './css/project-details.css'; // Import the CSS file
import './css/styles.css';

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) {
        const projectRef = doc(db, 'projects', projectId);
        const projectDoc = await getDoc(projectRef);
        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          // Check if members are in the correct format
          if (projectData.members && projectData.members.length > 0 && typeof projectData.members[0] === 'string') {
            // Convert members to the correct format
            const updatedMembers = projectData.members.map(email => ({ email }));
            await updateDoc(projectRef, { members: updatedMembers });
            projectData.members = updatedMembers;
          }
          setProject({ id: projectDoc.id, ...projectData });
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

  const handleRoleAssignment = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      const projectRef = doc(db, 'projects', projectId);
      const updatedMembers = project.members.map(member => 
        member.email === selectedUser ? { ...member, role: selectedRole } : member
      );

      await updateDoc(projectRef, { members: updatedMembers });

      setMessage(`Role "${selectedRole}" assigned to ${selectedUser}`);
      setSelectedUser('');
      setSelectedRole('');
    } catch (error) {
      setMessage(`Failed to assign role: ${error.message}`);
    }
  };

  const handleDeleteProject = async () => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await deleteDoc(projectRef);

      setMessage('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      setMessage(`Failed to delete project: ${error.message}`);
    }
  };

  const openNav = () => {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  };

  const closeNav = () => {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const isAdmin = project?.members.some(member => member.email === currentUser.email && member.role === 'admin');
  const isEditor = project?.members.some(member => member.email === currentUser.email && member.role === 'editor');
  const isViewer = project?.members.some(member => member.email === currentUser.email && member.role === 'viewer');

  return (
    <div>
      <nav className="navbar">
        <div className="navdiv">
          <div id="mySidebar" className="sidebar">
            <a href="#" className="closebtn" onClick={closeNav}>×</a>
            <Link to="/Invitations">Invitations</Link>
            <Link to="/Projects">Projects</Link>
            <Link to="/Settings">Settings</Link>
            <button onClick={handleLogout} className="logout-btn" to="/About">Sign Out</button>
          </div>
          <div id="main">
            <button className="openbtn" onClick={openNav}>☰</button>
          </div>
          <div className="logo">
            <Link to="/">
              <img src="../assets/pfp-update.png" alt="Bit Store Logo" height="100px" />
            </Link>
          </div>
        </div>
      </nav>
      {project ? (
        <>
          <h2>{project.projectName}</h2>
          <div className="file-upload-section">
            <h3>Files</h3>
            {(isAdmin || isEditor) && (
              <>
                <input type="file" id="file-upload" onChange={(e) => setFile(e.target.files[0])} />
                <label htmlFor="file-upload">Upload File</label>
                <button onClick={handleFileUpload}>Upload</button>
              </>
            )}
          </div>
          {project.files && project.files.length > 0 ? (
            <ul className="file-list">
              {project.files.map((file, index) => (
                <li key={index}>
                  <svg className="file-icon" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.42-3.58-8-8-8zM4 7h8v2H4V7z"></path>
                  </svg>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No files uploaded yet.</p>
          )}
          <div>
            <h3>Members</h3>
            {project.members && project.members.length > 0 ? (
              <ul className="members-list">
                {project.members.map((member, index) => (
                  <li key={index}>
                    {member.email} - {member.role || 'No role assigned'}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No members yet.</p>
            )}
          </div>
          {currentUser.email === project.createdBy || isAdmin ? (
            <div>
              <h3>Assign Roles</h3>
              <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">Select User</option>
                {project.members.map((member, index) => (
                  <option key={index} value={member.email}>{member.email}</option>
                ))}
              </select>
              <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <button onClick={handleRoleAssignment}>Assign Role</button>
              <button onClick={handleDeleteProject}>Delete Project</button>
            </div>
          ) : null}
          {message && <p>{message}</p>}
        </>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
}

export default ProjectDetails;