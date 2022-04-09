import mongoose from 'mongoose'

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    email: { type: String, required: true },
    commentIds: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
    username: { type: String, required: true },
    password: { type: String, required: true }
  })
)

export default User
