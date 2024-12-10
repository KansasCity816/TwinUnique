// addBlog.js

document.getElementById("blogForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("image").value;
    const author = document.getElementById("author").value;
    const date = new Date().toISOString().split("T")[0]; // Current date

    const newBlog = {
        title,
        content,
        image,
        author,
        date,
    };

    // Get blogs from local storage (simulating JSON file for demo purposes)
    let blogs = JSON.parse(localStorage.getItem("blogs")) || [];

    // Add new blog to the list
    blogs.push(newBlog);

    // Save back to local storage
    localStorage.setItem("blogs", JSON.stringify(blogs));

    // Clear the form
    document.getElementById("blogForm").reset();

    alert("Blog added successfully!");
});
