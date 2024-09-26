import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Feed({ setAuth }) {
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserPosts(token);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserPosts = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/post/userposts", {
        headers: { token: token },
      });
      if (response.ok) {
        const data = await response.json();
        setUserPosts(data);
      } else {
        console.error("Failed to fetch user books. Status:", response.status);
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
  return (
    <Fragment>
      <div className="feed">
        <h1>Your Posts</h1>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <ul className="post-list">
              {userPosts.map((post) => (
                <li key={post.post_id}>
                  <h3>{post.book_title}</h3>
                  <p>{post.content}</p>
                </li>
              ))}
            </ul>
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </Fragment>
  );
}

export default Feed;
