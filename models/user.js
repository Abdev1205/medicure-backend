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
  subjects: [
    {
      subjectName: String,
      Arena: Number,
      level: [
        {
          type: Number,
          score: Number,
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("Users", schema);
