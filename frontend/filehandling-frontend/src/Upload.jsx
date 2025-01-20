import React, { useState } from 'react';

function Upload() {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (event) => {
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
        console.log(data);
        setDescription('');
        setFile(null);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  return (
    <div>
      <h1>Upload File</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;