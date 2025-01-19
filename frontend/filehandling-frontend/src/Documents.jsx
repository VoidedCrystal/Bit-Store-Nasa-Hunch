import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const fetchDocuments = () => {
    fetch('http://127.0.0.1:8000/api/documents/')
      .then(response => response.json())
      .then(data => setDocuments(data))
      .catch(err => console.error('Error fetching documents:', err));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDownload = (url) => {
    fetch(url, {
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
        a.download = url.split('/').pop();
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch(err => console.error('Error downloading the file:', err));
  };

  const handleUpload = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    formData.append('document', file);

    fetch('http://127.0.0.1:8000/api/documents/', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setDescription('');
        setFile(null);
        fetchDocuments(); // Refresh the documents list
      })
      .catch(err => console.error('Error uploading the file:', err));
  };

  return (
    <div>
      <h1>Documents</h1>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>
      <button onClick={fetchDocuments}>Refresh</button>
      <ul>
        {documents.map(document => (
          <li key={document.id}>
            <Link to={`/preview/${document.id}/${encodeURIComponent(document.document)}`}>
              Preview {document.description}
            </Link>
            <button onClick={() => handleDownload(document.document)}>
              Download {document.description}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Documents;