import Post from "../models/postModel";

export const createPost = async (req, res) => {
  try{
    const{book_isbn, content} = req.body;
    const user_id = req.user.user_id;
    const newPost = await Post.create(user_id,book_isbn, content);
    res.status(201).json(newPost);
  }catch(err){
    console.error('Server Error',err.message);
    res.status(500).send('Server Error');
  }
}
export const getUserPosts = async (req, res) => {
  try{
    const user_id = req.user.user_id;
    const userPosts = await Post.findUserPosts(user_id);
    res.json(userPosts);
  }catch(err){
    console.error('Server Error',err.message);
    res.status(500).send('Server Error');
  }
}
export const getFeed = async (req, res) => {
  try{
    const user_id = req.user.user_id;
    const feed = await Post.findFeed(user_id);
    res.json(feed);
  }catch(err){
    console.error('Server Error',err.message);
    res.status(500).send('Server Error');
  }
} 
export const deletePost = async (req, res) => {
  try{
    const post_id = req.params.id;
    const deletedPost = await Post.delete(post_id);
    res.json(deletedPost);
  }catch(err){
    console.error('Server Error',err.message);
    res.status(500).send('Server Error');
  }
} 