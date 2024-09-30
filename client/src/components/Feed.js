import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar.js";

function Feed({ setAuth }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({}); // Store comments for each post
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchPosts(token);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchPosts = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/post/getfeed", {
        headers: { token: token },
      });
      if (response.ok) {
        const data = await response.json();
        // Ensure each post has a comments array
        const formattedData = data.map((post) => ({
          ...post,
          comments: post.comments || [], // Default to an empty array if comments are undefined
        }));
        setPosts(formattedData);
      } else {
        console.error("Failed to fetch posts. Status:", response.status);
        if (response.status === 401) {
          handleLogout();
        }
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
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
  const handleFeed = () => {
    navigate("/feed");
  };

  const handleCommentChange = (post_id, value) => {
    setComments((prev) => ({ ...prev, [post_id]: value })); // Update comment for specific post
  };

  const handleCommentSubmit = async (post_id) => {
    const token = localStorage.getItem("token");
    const content = comments[post_id];
    if (!content) return; // Don't submit if input is empty

    try {
      const response = await fetch(
        `http://localhost:3000/comment/create/${post_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (response.ok) {
        const newComment = await response.json();
        // Update local posts state to include the new comment
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.post_id === post_id
              ? { ...post, comments: [...(post.comments || []), newComment] }
              : post
          )
        );
        setComments((prev) => ({ ...prev, [post_id]: "" })); // Clear input
      } else {
        console.error("Failed to submit comment. Status:", response.status);
      }
    } catch (err) {
      console.error("Error submitting comment:", err.message);
    }
  };
  const handleFriend = () => {
    navigate("/friend");
  };

  return (
    <Fragment>
      <Navbar
        handleFeed={handleFeed}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleLogout={handleLogout}
        handleFriend={handleFriend}
      />
      <div className="feed">
        <h1>Your Feed</h1>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="card mb-3" key={post.post_id}>
              <div className="card-body border-bottom post-body">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src="https://picsum.photos/200"
                    alt=""
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <h6 className="fw-semibold mb-0 fs-4">{post.user_name}</h6>
                  <span className="fs-2">
                    <span className="p-1 bg-light rounded-circle d-inline-block"></span>
                    {new Date(post.time).toLocaleString()}
                  </span>
                </div>
                <p className="text-dark my-3">{post.content}</p>
                <div className="comments mt-3 comment-section">
                  <h6>Comments:</h6>
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div
                        key={comment.comment_id}
                        className="comment border-bottom mb-2 pb-2"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src="https://picsum.photos/30"
                            alt=""
                            className="rounded-circle"
                            width="30"
                            height="30"
                          />
                          <span className="fw-semibold">
                            {comment.user_name}:
                          </span>
                          <p className="text-dark mb-0 ms-2">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted mt-2">No comments yet</p>
                  )}
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add a comment..."
                    value={comments[post.post_id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post.post_id, e.target.value)
                    }
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => handleCommentSubmit(post.post_id)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </Fragment>
  );
}
export default Feed;
