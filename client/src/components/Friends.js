import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "../styles/Dashboard.css";

function Friends({ setAuth }) {
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // Store search results
  const [searchPerformed, setSearchPerformed] = useState(false); // Track if search was performed
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
      fetchUserRequests(token);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleUnauthorized = (response) => {
    console.error("Failed to fetch. Status:", response.status);
    if (response.status === 401) {
      handleLogout();
    }
  };

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

  // Function to handle search input change
  const handleSearchInput = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to call the search route and update search results
  const searchFriends = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:3000/friend/search?user_name=${query}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data); // Update the search results
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (err) {
      console.error("Search error:", err.message);
    }
  };

  // Function to handle search button click
  const handleSearchClick = () => {
    if (searchQuery) {
      setSearchPerformed(true); // Set the flag to indicate that a search was performed
      searchFriends(searchQuery);
    } else {
      setSearchPerformed(false); // Reset the flag if search query is empty
      setSearchResults([]); // Clear search results if the input is empty
    }
  };
  const fetchUserRequests = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/friend/getrequests", {
        headers: { token: token },
      });
      if (response.ok) {
        const data = await response.json();
        setReceivedRequests(data);
      } else {
        handleUnauthorized(response);
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  const handleFeed = () => {
    navigate("/feed");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/login");
  };

  const handlePost = () => {
    navigate("/post");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const sendFriendRequest = async (friend_id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/friend/sendrequest/${friend_id}`,
        {
          method: "POST",
          headers: { token: localStorage.getItem("token") },
        }
      );
      if (response.ok) {
        alert("Friend request sent successfully");
        setSentRequests([...sentRequests, friend_id]);
      } else {
        console.error("Failed to send friend request");
      }
    } catch (err) {
      console.error("Error sending friend request:", err.message);
    }
  };
  const acceptFriendRequest = async (friend_id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/friend/acceptrequest/${friend_id}`,
        {
          method: "POST",
          headers: { token: localStorage.getItem("token") },
        }
      );
    } catch (err) {
      console.error("Error accepting friend request:", err.message);
    }
  };
  const rejectFriendRequest = async (friend_id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/friend/rejectrequest/${friend_id}`,
        {
          method: "POST",
          headers: { token: localStorage.getItem("token") },
        }
      );
    } catch (err) {
      console.error("Error rejecting friend request:", err.message);
    }
  };

  return (
    <Fragment>
      <div className="sidebar d-flex flex-column">
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <svg className="bi me-2" width="40" height="32">
            <use xlinkHref="#bootstrap" />
          </svg>
          <span className="fs-4">Sidebar</span>
        </a>
        <hr />
        {/* Search bar */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Friends..."
            aria-label="Search"
            aria-describedby="search-friends"
            value={searchQuery}
            onChange={handleSearchInput} // Call handleSearchInput on input change
          />
          <button
            className="btn btn-primary mt-2"
            onClick={handleSearchClick} // Call handleSearchClick on button click
          >
            Search
          </button>
        </div>
        {/* Display search results only if search was performed */}
        <div>
          {searchPerformed && searchResults.length > 0 && (
            <ul className="list-group">
              {searchResults.map((user) => (
                <li
                  key={user.user_id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {user.user_name}
                  <button
                    className="btn btn-primary"
                    onClick={() => sendFriendRequest(user.user_id)}
                    disabled={sentRequests.includes(user.user_id)} // Disable the button if the request has been sent
                  >
                    <FontAwesomeIcon
                      icon={
                        sentRequests.includes(user.user_id)
                          ? "check"
                          : faUserPlus
                      } // Change icon to check if the request has been sent
                      className="me-3"
                    />
                    {sentRequests.includes(user.user_id)
                      ? "Request Sent"
                      : "Add Friend"}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {searchPerformed && searchResults.length === 0 && (
            <p>No user found</p>
          )}
        </div>
        <hr />
        {/* Dropdown for user - positioned at the bottom */}
        <div className="dropdown mt-auto">
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://picsum.photos/200/300?grayscale"
              alt="Profile"
              width="32"
              height="32"
              className="rounded-circle me-2"
            />
            <strong>{userData ? userData.user_name : "Loading..."}</strong>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-dark text-small shadow"
            aria-labelledby="dropdownUser1"
          >
            <li>
              <a className="dropdown-item" onClick={goToDashboard}>
                Dashboard
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={handleFeed}>
                Feed
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#" onClick={handlePost}>
                Post
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="#" onClick={handleLogout}>
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="friend-requests-section">
        <h3>Friend Requests</h3>
        {receivedRequests.length > 0 ? (
          <ul className="list-group">
            {receivedRequests.map((request) => (
              <li
                key={request.user_id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {request.user_name}
                <button
                  className="btn btn-primary ms-2"
                  onClick={() => acceptFriendRequest(request.user_id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => rejectFriendRequest(request.user_id)}
                >
                  Reject
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No friend requests</p>
        )}
      </div>
    </Fragment>
  );
}
export default Friends;
