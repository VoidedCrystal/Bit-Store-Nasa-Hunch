import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import { db } from './firebase/firebase'; 
import { collection, getDocs, addDoc } from 'firebase/firestore';
import './css/Projects.css';

function Projects() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [message, setMessage] = useState('');

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
  }, []);

  const createProject = async () => {
    if (!projectName) return;

    try {
      const projectsRef = collection(db, 'projects');
      await addDoc(projectsRef, {
        projectName,
        createdBy: currentUser.email,
        members: [{ email: currentUser.email }]
      });
      setMessage(`Project "${projectName}" created successfully`);
      setProjectName('');
      fetchProjects();
    } catch (error) {
      setMessage(`Failed to create project: ${error.message}`);
    }
  };

  return (
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
        {projects.length > 0 ? (
          <ul className="projects-list">
            {projects.map((project) => (
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
  );
}

export default Projects;