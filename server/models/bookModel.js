import db from "../db.js";

class Books{
  
 static async saveBook(book_isbn,title,author,cover_id,review,rating,user_id){
  const time = new Date();
  const result = await db.query(`INSERT INTO books (book_isbn, title, author,cover_id ,review, rating, time, user_id) 
  VALUES ($1, $2, $3, $4, $5, $6, $7) 
  RETURNING *`,
 [book_isbn, title, author,cover_id ,review, rating, time, user_id]);
 return result.rows[0];
 }
  static async findUserBooks(user_id){
    const result = await db.query('SELECT * FROM books WHERE user_id= $1', [user_id]);
    return result.rows;
  }
}
export default Books;