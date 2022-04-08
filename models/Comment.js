import mongoose from 'mongoose'

const Comment = mongoose.model(
  'Comment',
  new mongoose.Schema({
    author: { type: String, required: true },
    postedAt: { type: Date, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true }
  })
)

export default Comment
