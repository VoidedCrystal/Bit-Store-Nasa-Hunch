const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3000;

// MongoDB URI
const mongoURI = 'mongodb://localhost:27017/files';

// Create mongo connection
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create a schema and model for file metadata
const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    originalname: String,
    mimetype: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
});
const File = mongoose.model('File', fileSchema);

// Configure Multer storage to save files locally
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Route to serve the upload form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/files.ejs')); // Adjust the path as needed
});

// Route for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        console.log('File received:', req.file);

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const file = new File({
            filename: req.file.filename,
            path: req.file.path,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        await file.save();

        res.send('File uploaded successfully to local storage and metadata saved to MongoDB.');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while uploading the file.');
    }
});

// Route for file download
app.get('/download/:filename', async (req, res) => {
    try {
        const file = await File.findOne({ filename: req.params.filename });

        if (!file) {
            return res.status(404).send('File not found.');
        }

        res.download(file.path, file.originalname);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while downloading the file.');
    }
});

// Route to render the download page
app.get('/files', async (req, res) => {
    try {
        const files = await File.find({});
        res.render('files', { files });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while retrieving the files.');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
