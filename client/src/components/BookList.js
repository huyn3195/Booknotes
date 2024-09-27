// BookList.js
import React from "react";

const BookList = ({ books }) => {
  return (
    <div className="mt-4">
      <h3>Your Books:</h3>
      {books.length > 0 ? (
        <ul>
          {books.map((book, index) => (
            <li key={index}>
              <p>
                <strong>{book.title}</strong> by {book.author}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Read more and save more!!!!!</p>
      )}
    </div>
  );
};
export default BookList;
