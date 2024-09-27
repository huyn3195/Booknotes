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
            <div className="card mb-3" key={post.post_id}>
              <div className="card-body border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src="https://bootdey.com/img/Content/avatar/avatar1.png"
                    alt=""
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <h6 className="fw-semibold mb-0 fs-4">{post.user_name}</h6>
                  <span className="fs-2">
                    <span className="p-1 bg-light rounded-circle d-inline-block"></span>
                    {new Date(post.time).toLocaleString()}{" "}
                    {/* Format the date */}
                  </span>
                </div>
                <p className="text-dark my-3">{post.content}</p>
                <div className="d-flex align-items-center my-3">
                  <div className="d-flex align-items-center gap-2">
                    <a
                      className="text-white d-flex align-items-center justify-content-center bg-primary p-2 fs-4 rounded-circle"
                      href="javascript:void(0)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-title="Like"
                    >
                      <i className="fa fa-thumbs-up"></i>
                    </a>
                    <span className="text-dark fw-semibold">67</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 ms-4">
                    <a
                      className="text-white d-flex align-items-center justify-content-center bg-secondary p-2 fs-4 rounded-circle"
                      href="javascript:void(0)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-title="Comment"
                    >
                      <i className="fa fa-comments"></i>
                    </a>
                    <span className="text-dark fw-semibold">2</span>
                  </div>
                  <a
                    className="text-dark ms-auto d-flex align-items-center justify-content-center bg-transparent p-2 fs-4 rounded-circle"
                    href="javascript:void(0)"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Share"
                  >
                    <i className="fa fa-share"></i>
                  </a>
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
