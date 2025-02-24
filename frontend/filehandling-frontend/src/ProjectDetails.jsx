import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import { db, storage } from './firebase/firebase';
import { doc, getDoc, updateDoc, arrayUnion, collection, addDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import './css/project-details.css';

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser, handleLogout } = useAuth();
  const [project, setProject] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');

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

    const fileSizeLimit = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > fileSizeLimit) {
      setMessage('File size exceeds the 500MB limit.');
      return;
    }
    else {
      try {
        const fileId = uuidv4(); // Generate a unique ID for the file
        const fileRef = ref(storage, `projects/${projectId}/${fileId}`);
        await uploadBytes(fileRef, file);
        const fileURL = await getDownloadURL(fileRef);

        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
          files: arrayUnion({ id: fileId, name: file.name, url: fileURL })
        });

        setMessage(`File "${file.name}" uploaded successfully`);
        setFile(null);
        const projectDoc = await getDoc(projectRef);
        setProject({ id: projectDoc.id, ...projectDoc.data() }); // Update project details
      } catch (error) {
        setMessage(`Failed to upload file: ${error.message}`);
      }
    }
  };

  const handleDeleteProject = async () => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectDoc = await getDoc(projectRef);
      if (projectDoc.exists()) {
        const files = projectDoc.data().files || [];
        // Delete all files from Firebase Storage
        for (const file of files) {
          const fileRef = ref(storage, file.url);
          await deleteObject(fileRef);
        }
        // Delete the project document from Firestore
        await deleteDoc(projectRef);
        setMessage('Project deleted successfully');
        navigate('/Projects'); // Redirect to the projects list after deletion
      } else {
        setMessage('No such project exists');
      }
    } catch (error) {
      setMessage(`Failed to delete project: ${error.message}`);
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
      const projectDoc = await getDoc(projectRef);
      setProject({ id: projectDoc.id, ...projectDoc.data() }); // Update project details
    } catch (error) {
      setMessage(`Failed to assign role: ${error.message}`);
    }
  };

  const sendInvitation = async () => {
    if (!email) return;

    try {
      const invitationsRef = collection(db, 'invitations');
      await addDoc(invitationsRef, {
        projectId,
        email,
        status: 'pending'
      });
      setMessage(`Invitation sent to ${email}`);
      setEmail('');
    } catch (error) {
      setMessage(`Failed to send invitation: ${error.message}`);
    }
  };

  const closeNav = () => {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  };

  const openNav = () => {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
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
            <Link to="/About"><button onClick={handleLogout} className="logout-btn" >Sign Out</button></Link>
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
                <p>500mb limit</p>
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
                  <Link to={`/preview/${projectId}/${file.id}`}>{file.name}</Link>
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
            </div>
          ) : null}
          <div>
            <h3>Invite Members</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <button onClick={sendInvitation}>Send Invitation</button>
          </div>
          {message && <p>{message}</p>}
          {(isAdmin || currentUser.email === project.createdBy) && (
            <button onClick={handleDeleteProject} className="delete-project-btn">Delete Project</button>
          )}
        </>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
}

export default ProjectDetails;