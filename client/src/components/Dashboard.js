import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ setAuth }) {
  const [userData, setUserData] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchUserBooks();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/dashboard", {
        headers: { token: localStorage.getItem("token") },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  const fetchUserBooks = async () => {
    try {
      const response = await fetch("http://localhost:3000/books", {
        headers: { token: localStorage.getItem("token") },
      });
      if (response.ok) {
        const data = await response.json();
        setUserBooks(data);
      } else {
        console.error("Failed to fetch user books");
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
  const handlePost = () => {
    navigate("/post");
  };

  return (
    <Fragment>
      {/* Navigation Bar */}
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

      {/* Main Dashboard Section */}
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
                              <p>You have no books saved.</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>

                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src="https://img.buzzfeed.com/buzzfeed-static/static/2017-03/23/15/asset/buzzfeed-prod-fastlane-01/sub-buzz-27949-1490298158-6.jpg"
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
