const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname)); // Serve static files

// Route to serve the add-blog.html file directly from the root directory
app.get('/add-blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'add-blog.html'));
});

// Route to serve the blog-list.html file directly from the root directory
app.get('/blog-list', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog-list.html'));
});

// Blog API
const blogsFilePath = path.join(__dirname, 'blogs.json');

// Utility function to read blogs.json
const readBlogs = () => {
    if (!fs.existsSync(blogsFilePath)) {
        fs.writeFileSync(blogsFilePath, '[]');
    }
    return JSON.parse(fs.readFileSync(blogsFilePath, 'utf8'));
};

// Utility function to save blogs to blogs.json
const saveBlogs = (blogs) => {
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));
};

// API to get all blogs
app.get('/api/blogs', (req, res) => {
    const blogs = readBlogs();
    res.json(blogs);
});

// API to add a new blog
app.post('/api/blogs', (req, res) => {
    const { title, category, description, image } = req.body;

    if (!title || !category || !description || !image) {
        return res.status(400).send('Missing required fields');
    }

    const blogs = readBlogs();
    const slug = title.toLowerCase().replace(/\s+/g, '-'); // Create slug for blog filename
    const newBlog = {
        title,
        category,
        description,
        image,
        slug,
        date: new Date().toISOString(),
    };
    blogs.push(newBlog);
    saveBlogs(blogs);

    // Generate blog HTML
    const blogContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <h1>${title}</h1>
    <p><strong>Category:</strong> ${category}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <img src="/assets/images/blog/${image}" alt="${title}" style="max-width:100%; height:auto;">
    <p>${description}</p>
</body>
</html>
    `;

    const blogFilePath = path.join(__dirname, 'pages/Blog', `${slug}.html`);
    fs.writeFileSync(blogFilePath, blogContent);

    res.status(201).send('Blog added and page created!');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
