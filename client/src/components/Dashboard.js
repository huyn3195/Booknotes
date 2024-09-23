import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "../styles/Dashboard.css";

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
        console.error("Failed to fetch user data. Status:", response.status);
        if (response.status === 401) {
          // Unauthorized
          handleLogout();
        }
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
        console.error("Failed to fetch user books. Status:", response.status);
        if (response.status === 401) {
          // Unauthorized
          handleLogout();
        }
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
        console.error("Failed to fetch user posts. Status:", response.status);
        if (response.status === 401) {
          // Unauthorized
          handleLogout();
        }
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
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

        // Update currentCardIndex if necessary
        if (currentCardIndex >= updatedPosts.length) {
          // If the current index is out of bounds, reset to the last index or to 0
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
      <nav className="navbar navbar-light bg-light justify-content-between">
        <a className="navbar-brand">Dashboard</a>
        <form className="form-inline" onSubmit={handleSearch}>
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
          >
            Search
          </button>
        </form>
        <button onClick={handlePost} className="btn btn-primary">
          Post
        </button>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </nav>

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
                          <div className="mt-4">
                            <h3>Your Books:</h3>
                            {userBooks.length > 0 ? (
                              <ul>
                                {userBooks.map((book, index) => (
                                  <li key={index}>
                                    <p>
                                      <strong>{book.title}</strong> by{" "}
                                      {book.author}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>Read more and save more!!!!!</p>
                            )}
                          </div>

                          {userPosts.length > 0 ? (
                            <div
                              className="card position-relative"
                              style={{ width: "18rem" }}
                            >
                              <div className="card-body text-center">
                                <h5 className="card-title">
                                  {userPosts[currentCardIndex].book_title}
                                </h5>
                                <p className="card-text">
                                  {userPosts[currentCardIndex].content}
                                </p>
                                <button
                                  onClick={() =>
                                    handleDelete(
                                      userPosts[currentCardIndex].post_id
                                    )
                                  }
                                  className="btn btn-danger"
                                >
                                  Delete
                                </button>
                              </div>

                              <FontAwesomeIcon
                                icon={faArrowLeft}
                                className="icon-arrow-left"
                                onClick={prevCard}
                              />
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="icon-arrow-right"
                                onClick={nextCard}
                              />
                            </div>
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
