import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import { db, storage } from './firebase/firebase'; // Import Firestore and Storage
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'; // Import Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Storage functions

function ProjectDetails() {
  const { projectId } = useParams();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

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
      {project ? (
        <>
          <h2>{project.projectName}</h2>
          <div>
            <h3>Files</h3>
            {project.files && project.files.length > 0 ? (
              <ul>
                {project.files.map((file, index) => (
                  <li key={index}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                  </li>
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