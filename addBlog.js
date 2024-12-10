document.getElementById("addBlogForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const image = document.getElementById("image").value.trim() || "assets/images/blog/house-1.jpg";
    const author = document.getElementById("author").value.trim();
    const date = new Date().toLocaleDateString(); // Auto-generate date

    // Validate form fields
    if (!title || !content || !image) {
        alert("Please fill out all required fields: Title, Content, and Image.");
        return;
    }

    // Generate slug for the blog title
    const slug = title.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9\-]/g, "");

    // Create a blog object
    const newBlog = {
        id: slug,
        title,
        content,
        image,
        date,
        author: author || "Anonymous", // Default to 'Anonymous' if author is empty
    };

    try {
        // Get existing blogs from localStorage
        const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

        // Check for duplicate blog title
        if (blogs.some(blog => blog.id === slug)) {
            alert("A blog with this title already exists. Please use a different title.");
            return;
        }

        // Add new blog to the list
        blogs.push(newBlog);

        // Save updated blogs back to localStorage
        localStorage.setItem("blogs", JSON.stringify(blogs));

        // Success message
        alert("Blog added successfully!");
        window.location.href = "blog-list.html"; // Redirect to blog list page
    } catch (error) {
        console.error("Error adding blog:", error);
        alert("An unexpected error occurred while adding the blog. Please try again.");
    }
});
