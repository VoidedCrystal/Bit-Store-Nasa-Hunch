import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import { db } from './firebase/firebase'; // Import Firestore
import { collection, getDocs, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore'; // Import Firestore functions

function Projects() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const fetchProjects = async () => {
    try {
      const projectsRef = collection(db, 'projects');
      const projectsSnapshot = await getDocs(projectsRef);
      const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched projects:', projectsList);
      // Filter projects to include only those where the current user is a member
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
      fetchProjects(); // Fetch projects again to update the list
    } catch (error) {
      setMessage(`Failed to create project: ${error.message}`);
    }
  };

  const sendInvitation = async (projectId) => {
    if (!email) return;

    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        members: arrayUnion({ email })
      });
      setMessage(`Invitation sent to ${email}`);
      setEmail('');
      fetchProjects(); // Fetch projects again to update the list
    } catch (error) {
      setMessage(`Failed to send invitation: ${error.message}`);
    }
  };

  return (
    <div>
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