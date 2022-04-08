import mongoose from 'mongoose'

const Post = mongoose.model(
  'Post',
  new mongoose.Schema({
    author: { type: String, required: true },
    postedAt: { type: Date, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true }
  })
)

export default Post
