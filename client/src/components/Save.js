import React, { Fragment, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Saves.css"; // Ensure custom styles are applied

function Save() {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure the passed data from location.state
  const { isbn, title, author_name, coverUrl } = location.state || {};

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating || !review) {
      alert("Please fill out all fields");
      return;
    }

    const payload = {
      book_isbn: isbn,
      title: title,
      author: author_name,
      cover_url: coverUrl,
      rating: rating,
      review: review,
    };

    try {
      const response = await fetch("http://localhost:3000/books/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Book saved successfully");
        navigate("/dashboard");
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (err) {
      console.error("Error:", err.message);
      alert("An error occurred while saving the book. Please try again.");
    }
  }

  return (
    <Fragment>
      <div className="container mt-5 d-flex justify-content-between">
        <div className="leftSide col-md-6">
          <img src={coverUrl} alt={title} className="book-cover mb-3" />
          <div className="book-info">
            <h2>Book Details</h2>
            <p>
              <strong>Title:</strong> {title}
            </p>
            <p>
              <strong>Author:</strong> {author_name}
            </p>
            <p>
              <strong>ISBN:</strong> {isbn}
            </p>
          </div>
        </div>

        <div className="rightSide col-md-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="rating">
                <h3>Star Rating (Out of 5)</h3>
              </label>
              <select
                id="rating"
                className="form-control"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))} // Ensure rating is a number
              >
                <option value="0">Choose Rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <div className="form-group mt-4">
              <label htmlFor="review">
                <h3>Review</h3>
              </label>
              <textarea
                id="review"
                className="form-control"
                rows="5"
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary mt-4">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default Save;
