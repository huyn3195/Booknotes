import Books from "../models/bookModel.js";
import axios from "axios";

export const findBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const apiResponse = await axios.get(
      `https://openlibrary.org/search.json?q=${query}`
    );
    const data = apiResponse.data;

    if (data.docs.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    // Add cover URLs to the books
    const booksWithCovers = data.docs.map((book) => {
      // Check if the book has an ISBN to use for the cover
      const isbn = book.isbn ? book.isbn[0] : null;
      let coverUrl = null;
      if (isbn) {
        // Generate the cover URL using the Open Library API
        coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`; // Using 'M' for medium size
      }
      return {
        ...book,
        coverUrl,
      };
    });
    return res.json(booksWithCovers);
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).send("Server Error");
  }
};
export const saveBook = async (req, res) => {
  try {
    const { book_isbn, title, author, cover_url, review, rating } = req.body;
    const user_id = req.user; // Verify this is correctly populated
    console.log("User ID:", user_id); // Debugging line to check user_id value

    const savedBook = await Books.saveBook(
      book_isbn,
      title,
      author,
      cover_url,
      review,
      rating,
      user_id
    );
    return res.status(201).json(savedBook); // Return JSON response
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).send("Server Error");
  }
};

export const getUserBooks = async (req, res) => {
  try {
    const user_id = req.user;
    const userBooks = await Books.findUserBooks(user_id);
    return res.json(userBooks);
  } catch (err) {
    console.error("Server Error:", err.message);
    return res.status(500).send("Server Error");
  }
};
