import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import PostCard from "./PostCard.js";
import BookList from "./BookList.js";
import Navbar from "./NavBar";

function Dashboard({ setAuth }) {
  const [userData, setUserData] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
      fetchUserBooks(token);
      fetchUserPosts(token);
    } else {
      navigate("/login");
    }

    // Load Botpress chatbot scripts
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.1/inject.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src =
      "https://mediafiles.botpress.cloud/d3aa6ca5-393a-4832-9ce6-bd9aa8fb5b24/webchat/v2.1/config.js";
    script2.async = true;
    document.body.appendChild(script2);

    // Cleanup scripts on component unmount
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/dashboard", {
        headers: { token: token },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        handleUnauthorized(response);
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  const fetchUserBooks = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/books/mybooks", {
        headers: { token: token },
      });
      if (response.ok) {
        const data = await response.json();
        setUserBooks(data);
      } else {
        handleUnauthorized(response);
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  const fetchUserPosts = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/post/userposts", {
        headers: { token: token },
      });
      if (response.ok) {
        const data = await response.json();
        setUserPosts(data);
      } else {
        handleUnauthorized(response);
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  const handleUnauthorized = (response) => {
    console.error("Failed to fetch. Status:", response.status);
    if (response.status === 401) {
      handleLogout();
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/post/delete/${id}`, {
        method: "DELETE",
        headers: { token: localStorage.getItem("token") },
      });
      if (response.ok) {
        const updatedPosts = userPosts.filter((post) => post.post_id !== id);
        setUserPosts(updatedPosts);
        if (currentCardIndex >= updatedPosts.length) {
          setCurrentCardIndex(
            updatedPosts.length > 0 ? updatedPosts.length - 1 : 0
          );
        }
      } else {
        console.error("Failed to delete post. Status:", response.status);
      }
    } catch (err) {
      console.error("Deletion error:", err.message);
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

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === userPosts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? userPosts.length - 1 : prevIndex - 1
    );
  };

  const handlePost = () => {
    navigate("/post");
  };

  return (
    <Fragment>
      <Navbar
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleFeed={handleFeed}
        handlePost={handlePost}
        handleLogout={handleLogout}
      />
      <section className="vh-100" style={{ backgroundColor: "#eee" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      {userData ? (
                        <div>
                          <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                            Welcome, {userData.user_name}
                          </p>
                          <BookList books={userBooks} />
                          {userPosts.length > 0 ? (
                            <PostCard
                              post={userPosts[currentCardIndex]}
                              onDelete={() =>
                                handleDelete(
                                  userPosts[currentCardIndex].post_id
                                )
                              }
                              onNext={nextCard}
                              onPrev={prevCard}
                            />
                          ) : (
                            <p>Post here</p>
                          )}
                        </div>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src="https://ih1.redbubble.net/image.2066877613.0598/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
                        className="img-fluid"
                        alt="Dashboard"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Dashboard;
