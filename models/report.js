import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  bloodgroup: {
    type: String,
  },
  weight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  analysis: {
    type: String,
  },
  parameters: {
    type: Object,
    required: true
  },
  img: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Reports = mongoose.model("Reports", schema);
