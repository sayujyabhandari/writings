const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Endpoint to handle writing uploads
app.post('/upload', upload.single('writing'), (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const filename = req.file ? req.file.filename : '';
    const writingData = { title, content: content.replace(/\r\n|\r|\n/g, '\n'), filename };

    // Store the writing details in a file (simple storage approach)
    fs.writeFileSync(`uploads/${title}.json`, JSON.stringify(writingData));

    res.redirect('/');
});

// Endpoint to list writings
app.get('/writings', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            res.status(500).send('Error reading writings');
            return;
        }

        const writings = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filePath = path.join('uploads', file);
                return {
                    content: JSON.parse(fs.readFileSync(filePath)),
                    mtime: fs.statSync(filePath).mtime // Get file's last modified time
                };
            })
            // Sort the writings by last modified time, newest first
            .sort((a, b) => b.mtime - a.mtime)
            .map(writing => writing.content); // Extract the content after sorting

        res.json(writings);
    });
});

// Endpoint to delete a writing
app.delete('/writings/:title', (req, res) => {
    const title = req.params.title;
    const filePath = path.join('uploads', `${title}.json`);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
        res.status(200).send('Writing deleted successfully');
    } else {
        res.status(404).send('Writing not found');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

