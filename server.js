const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Static files like HTML/CSS/JS

// Serve the Blog Add Page
app.get('/add-blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-blog.html'));
});

// Blog API
let blogs = [];

app.get('/api/blogs', (req, res) => {
    res.json(blogs);
});

app.post('/api/blogs', (req, res) => {
    const { title, category, description } = req.body;
    if (title && category && description) {
        blogs.push({ title, category, description, date: new Date() });
        res.status(201).send('Blog added!');
    } else {
        res.status(400).send('Missing fields');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
