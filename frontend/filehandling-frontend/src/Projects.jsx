import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import { db } from './firebase/firebase'; // Import Firestore
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'; // Import Firestore functions
import './css/File.css';
import './css/styles.css'
import Home from './Home';

function Projects() {
  const { currentUser } = useAuth();
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [projects, setProjects] = useState([]);

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

  useEffect(() => {
    const fetchProjects = async () => {
      if (currentUser) {
        const q = query(collection(db, 'projects'), where('members', 'array-contains', currentUser.email));
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(fetchedProjects);
      }
    };

    fetchProjects();
  }, [currentUser]);

  const createProject = async () => {
    if (!projectName) return;

    try {
      // Create a new project in Firestore
      await addDoc(collection(db, 'projects'), {
        projectName,
        createdBy: currentUser.email,
        members: [currentUser.email]
      });

      setMessage(`Project "${projectName}" created`);
      setProjectName('');
    } catch (error) {
      setMessage(`Failed to create project: ${error.message}`);
    }
  };

  const sendInvitation = async (projectId) => {
    if (!email) return;

    try {
      // Store the invitation in Firestore
      await addDoc(collection(db, 'invitations'), {
        email,
        projectId,
        invitedBy: currentUser.email,
        status: 'pending'
      });

      setMessage(`Invitation sent to ${email}`);
      setEmail('');
    } catch (error) {
      setMessage(`Failed to send invitation: ${error.message}`);
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
      <h2>Projects</h2>
      <div>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
          required
        />
        <button onClick={createProject}>Create Project</button>
      </div>
      {message && <p>{message}</p>}
      <div>
        <h3>Your Projects</h3>
        {projects.length > 0 ? (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <Link to={`/projects/${project.id}`}>{project.projectName}</Link>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Invite member by email"
                    required
                  />
                  <button onClick={() => sendInvitation(project.id)}>Send Invitation</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>You are not part of any projects yet.</p>
        )}
      </div>
    </div>
  );
}

export default Projects;