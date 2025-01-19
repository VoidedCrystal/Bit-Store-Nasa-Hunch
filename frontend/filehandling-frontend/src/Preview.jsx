import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Preview() {
  const { id, url } = useParams();
  const decodedUrl = decodeURIComponent(url);
  const navigate = useNavigate();

  console.log('Previewing file from URL:', decodedUrl); // Debugging: Log the decoded URL
  console.log('Document ID:', id); // Debugging: Log the document ID

  const handleDownload = () => {
    fetch(decodedUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = decodedUrl.split('/').pop();
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch(err => console.error('Error downloading the file:', err));
  };

  const handleDelete = () => {
    console.log('Deleting document with ID:', id); // Debugging: Log the document ID
    fetch(`http://127.0.0.1:8000/api/documents/${id}/`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        navigate('/'); // Redirect to the documents list after deletion
      })
      .catch(err => console.error('Error deleting the file:', err));
  };

  return (
    <div>
      <h1>Preview</h1>
      {decodedUrl.endsWith('.pdf') ? (
        <embed src={decodedUrl} width="600" height="500" type="application/pdf" />
      ) : (
        <img src={decodedUrl} alt="Preview" width="600" />
      )}
      <button onClick={handleDownload}>Download</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default Preview;