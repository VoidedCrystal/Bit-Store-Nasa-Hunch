import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from './firebase/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';

function Preview() {
  const { projectId, fileId } = useParams();
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const projectRef = doc(db, 'projects', projectId);
        const projectDoc = await getDoc(projectRef);
        if (projectDoc.exists()) {
          const file = projectDoc.data().files.find(f => f.id === fileId);
          if (file) {
            setFileUrl(file.url);
            setFileName(file.name);
          } else {
            console.error('No such file!');
          }
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchFile();
  }, [projectId, fileId]);

  const handleDownload = async () => {
    try {
      const downloadUrl = await getDownloadURL(ref(storage, fileUrl));
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectDoc = await getDoc(projectRef);
      if (projectDoc.exists()) {
        const updatedFiles = projectDoc.data().files.filter(f => f.id !== fileId);
        await updateDoc(projectRef, { files: updatedFiles });
        await deleteObject(ref(storage, fileUrl));
        navigate('/projects/' + projectId);
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error deleting the file:', error);
    }
  };

  return (
    <div>
      <h1>Preview</h1>
      {fileUrl.endsWith('.pdf') ? (
        <embed src={fileUrl} width="600" height="500" type="application/pdf" />
      ) : (
        <img src={fileUrl} alt="Preview" width="600" />
      )}
      <button onClick={handleDownload}>Download</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default Preview;