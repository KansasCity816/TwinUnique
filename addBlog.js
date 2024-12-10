document.getElementById("addBlogForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const image = document.getElementById("image").value.trim() || "assets/images/blog/house-1.jpg";
    const date = new Date().toLocaleDateString(); // Auto-generate date
    const author = document.getElementById("author").value.trim(); // Optional author field

    // Validate form fields
    if (!title || !content || !image) {
        alert("All fields are required!");
        return;
    }

    // Create a blog object
    const newBlog = {
        title,
        content,
        image,
        date,
        author: author || "Anonymous", // Default to 'Anonymous' if author is empty
    };

    try {
        // Get existing blogs from localStorage
        const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

        // Add new blog to the list
        blogs.push(newBlog);

        // Save updated blogs back to localStorage
        localStorage.setItem("blogs", JSON.stringify(blogs));

        // Success message
        alert("Blog added successfully!");
        window.location.href = "Blog-list.html"; // Redirect to blog list page
    } catch (error) {
        console.error("Error adding blog:", error);
        alert("Error adding blog. Please try again.");
    }
});
