// Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";

function Navbar({
  handleSearch,
  searchQuery,
  setSearchQuery,
  handleFeed,
  handlePost,
  handleLogout,
  handleFriend,
}) {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="navbar navbar-light bg-light justify-content-between">
      <button className="navbar-brand btn" onClick={goToDashboard}>
        Dashboard
      </button>
      <form className="form-inline" onSubmit={handleSearch}>
        <input
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
          Search
        </button>
      </form>
      <div className="d-flex">
        <button
          onClick={handleFriend}
          className="btn btn-light mx-2"
          aria-label="Friends"
          title="Friends"
        >
          <FontAwesomeIcon icon={faUserFriends} size="lg" />
        </button>
        <button onClick={handleFeed} className="btn btn-primary mx-1">
          Feed
        </button>
        <button onClick={handlePost} className="btn btn-primary mx-1">
          Post
        </button>
        <button onClick={handleLogout} className="btn btn-danger mx-1">
          Logout
        </button>
      </div>
    </nav>
  );
}
export default Navbar;
