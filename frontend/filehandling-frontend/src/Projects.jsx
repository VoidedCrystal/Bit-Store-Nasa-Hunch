import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import { db } from './firebase/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import './css/Projects.css';

function Projects() {
  const { logout } = useAuth();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Add state for search query

  const fetchProjects = async () => {
    try {
      const projectsRef = collection(db, 'projects');
      const projectsSnapshot = await getDocs(projectsRef);
      const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched projects:', projectsList);
      const userProjects = projectsList.filter(project => 
        project.members.some(member => member.email === currentUser.email)
      );
      setProjects(userProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentUser.email]);

  const createProject = async () => {
    if (!projectName) return;

    try {
      const projectsRef = collection(db, 'projects');
      await addDoc(projectsRef, {
        projectName,
        createdBy: currentUser.email,
        members: [{ email: currentUser.email, role: 'admin' }] // Add the current user as an admin
      });
      setMessage(`Project "${projectName}" created successfully`);
      setProjectName('');
      fetchProjects(); // Refresh the projects list
    } catch (error) {
      setMessage(`Failed to create project: ${error.message}`);
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

  const filteredProjects = projects.filter(project =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <nav className="navbar">
        <div className="navdiv">
          <div id="mySidebar" className="sidebar">
            <a href="#" className="closebtn" onClick={closeNav}>×</a>
            <Link to="/Invitations">Invitations</Link>
            <Link to="/Projects">Projects</Link>
            <Link to="/Settings">Settings</Link>
            <Link to="/About"><button onClick={handleLogout} className="logout-btn">Sign Out</button></Link>
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
      <div className="projects-container">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
          required
        />
        <button onClick={createProject}>Create Project</button>
        {message && <p>{message}</p>}
        <div>
          <h3>Your Projects</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Projects"
          />
          {filteredProjects.length > 0 ? (
            <ul className="projects-list">
              {filteredProjects.map((project) => (
                <li key={project.id}>
                  <Link to={`/projects/${project.id}`}>{project.projectName}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No projects found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;