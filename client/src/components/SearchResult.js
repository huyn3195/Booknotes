import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import _ from "lodash";

function SearchResults() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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

  const debouncedFetchBooks = _.debounce((query, page) => {
    fetchBooks(query, page);
  }, 300);

  useEffect(() => {
    setBooks([]);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    if (query && page > 0) {
      debouncedFetchBooks(query, page);
    }
  }, [query, page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container mt-5">
      <h2>Search Results</h2>
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
  );
}

export default SearchResults;
