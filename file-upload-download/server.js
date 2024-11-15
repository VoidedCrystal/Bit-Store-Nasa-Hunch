const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appends the extension of the original file
    }
});

const upload = multer({ storage: storage });

// Ensure the upload directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Route to serve the upload form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload_form.html')); // Adjust the path as needed
});

// Route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully.');
});

// Route for file download
app.get('/download', (req, res) => {
    const filename = req.query.filename;
    const filepath = path.join(__dirname, 'uploads', filename);
    
    // Check if file exists
    if (fs.existsSync(filepath)) {
        res.download(filepath);
    } else {
        res.status(404).send('File not found.');
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
