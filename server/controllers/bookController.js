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
    return res.json(data.docs);
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).send("Server Error");
  }
};
export const saveBook = async (req, res) => {
  try {
    const { isbn, title, author, cover_id, review, rating } = req.body;
    const user_id = req.user_id;
    const savedBook = await Books.saveBook(
      isbn,
      title,
      author,
      cover_id,
      review,
      rating,
      user_id
    );
    return res.status(201).send(savedBook);
  } catch (err) {
    console.error("Server Error", err.message);
  }
};
export const getUserBooks = async (req, res) => {
  try {
    const user_id = req.user.id;
    const userBooks = await Books.findUserBooks(user_id);
    return res.json(userBooks);
  } catch (err) {
    console.error("Server Error:", err.message);
    return res.status(500).send("Server Error");
  }
};
