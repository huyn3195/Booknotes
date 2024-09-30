import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import Navbar from "./NavBar.js"; // Adjust the import path based on your file structure

function SearchResults({ setAuth }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const fetchBooks = async (query, page) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/books/search?query=${query}&page=${page}&limit=10`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length < 10) {
          setHasMore(false);
        }
        setBooks((prevBooks) => [...prevBooks, ...data]);
      } else {
        console.error("Failed to fetch books");
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/login");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setBooks([]); // Clear previous search results
    setPage(1); // Reset to first page
    setHasMore(true); // Reset hasMore flag
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const debouncedFetchBooks = _.debounce((query, page) => {
    fetchBooks(query, page);
  }, 300);

  useEffect(() => {
    if (query) {
      setBooks([]);
      setHasMore(true);
      setPage(1);
    }
  }, [query]);

  useEffect(() => {
    if (query && page > 0) {
      debouncedFetchBooks(query, page);
    }
  }, [query, page]);
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const handleSave = (book) => {
    navigate("/save", {
      state: {
        isbn: book.isbn && book.isbn.length > 0 ? book.isbn[0] : "N/A",
        title: book.title,
        author_name: book.author_name,
        coverUrl: book.coverUrl,
      },
    });
  };
  const handleFriend = () => {
    navigate("/friend");
  };
  return (
    <Fragment>
      <Navbar
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleFeed={() => navigate("/feed")} // Example feed handler
        handlePost={() => navigate("/post")} // Example post handler
        handleLogout={handleLogout}
        handleFriend={handleFriend}
      />
      <div className="container mt-5">
        {loading && <p>Loading...</p>}
        {books.length > 0 ? (
          <ul className="list-unstyled">
            {books.map((book, index) => (
              <li key={index} className="media mb-4">
                <img
                  src={book.coverUrl}
                  className="mr-3"
                  alt={book.title}
                  style={{ width: "100px" }}
                />
                <div className="media-body">
                  <h5 className="mt-0 mb-1">{book.title}</h5>
                  <p>by {book.author_name}</p>
                  <p>
                    ISBN{" "}
                    {book.isbn && book.isbn.length > 0 ? book.isbn[0] : "N/A"}
                    <button
                      onClick={() => handleSave(book)}
                      className="btn btn-primary float-right"
                    >
                      Save
                    </button>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No books found.</p>
        )}
        {hasMore && !loading && (
          <button onClick={loadMore} className="btn btn-primary">
            Load More
          </button>
        )}
      </div>
    </Fragment>
  );
}
export default SearchResults;
