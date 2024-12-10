const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));

// Serve Add Blog Page
app.get('/add-blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'add-blog.html'));
});

// Serve Blog List
app.get('/blog-list', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog-list.html'));
});

// API for fetching all blogs
app.get('/api/blogs', (req, res) => {
    const blogs = JSON.parse(fs.readFileSync('./blogs.json', 'utf8'));
    res.json(blogs);
});

// API for creating a new blog
app.post('/api/blogs', (req, res) => {
    const { title, date, author, category, image, description, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required.' });
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const blogData = {
        id: slug,
        title,
        date,
        author: author || 'Anonymous',
        category,
        image: image || 'assets/images/blog/house-1.jpg',
        description,
        content,
    };

    // Read blogs.json and update
    const blogsFilePath = path.join(__dirname, 'blogs.json');
    const blogs = JSON.parse(fs.readFileSync(blogsFilePath, 'utf8'));
    blogs.push(blogData);
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));

    // Read blog-template.html and replace placeholders
    const templatePath = path.join(__dirname, 'blog-template.html');
    const template = fs.readFileSync(templatePath, 'utf8');
    const populatedTemplate = template
        .replace(/{{title}}/g, blogData.title)
        .replace(/{{date}}/g, blogData.date)
        .replace(/{{author}}/g, blogData.author)
        .replace(/{{category}}/g, blogData.category)
        .replace(/{{image}}/g, blogData.image)
        .replace(/{{description}}/g, blogData.description)
        .replace(/{{content}}/g, blogData.content);

    // Save new blog post to pages/Blog
    const blogFilePath = path.join(__dirname, `pages/Blog/${slug}.html`);
    fs.writeFileSync(blogFilePath, populatedTemplate);

    res.status(201).json({ message: 'Blog created successfully.', url: `/pages/Blog/${slug}.html` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
