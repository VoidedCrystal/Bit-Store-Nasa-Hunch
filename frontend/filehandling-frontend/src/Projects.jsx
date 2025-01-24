import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import { db } from './firebase/firebase'; // Import Firestore
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'; // Import Firestore functions

function Projects() {
  const { currentUser } = useAuth();
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [projects, setProjects] = useState([]);

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