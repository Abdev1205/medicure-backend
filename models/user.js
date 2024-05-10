import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password : {
    type : String,
    required : true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("Users", schema);
