import React, { useState, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Post.css"; // Import the CSS file for styling
import Navbar from "./NavBar.js";

function Post({ setAuth }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputs, setInputs] = useState({
    book_title: "",
    content: "",
  });
  const { book_title, content } = inputs;
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/login");
  };
  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };
  const handleFriend = () => {
    navigate("/friend");
  };
  async function onSubmitForm(event) {
    event.preventDefault();
    if (!book_title || !content) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const body = { book_title, content };
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      const response = await fetch("http://localhost:3000/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token, // Add token in the header without 'Bearer'
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        const error = await response.json();
        alert("An error occurred with creating post: " + error.message);
      }
    } catch (err) {
      console.error(err.message);
      alert("An error occurred with creating post");
    }
  }

  return (
    <Fragment>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleLogout={handleLogout}
        handleFeed={() => navigate("/feed")} // Example feed handler
        handlePost={() => navigate("/post")}
        handleFriend={handleFriend}
      />
      <div className="post-container">
        <h1>Create a Post</h1>
        <form onSubmit={onSubmitForm} className="post-form">
          <div className="form-group">
            <label htmlFor="book_title">Title:</label>
            <input
              type="text"
              id="book_title"
              name="book_title"
              value={book_title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Post
          </button>
        </form>
      </div>
    </Fragment>
  );
}

export default Post;
