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
    // inference: { type: String },
    // akiec: { type: String },
    // bcc: { type: String },
    // bkl: { type: String },
    // df: { type: String },
    // mel: { type: String },
    // nv: { type: String },
    // vasc: {type: String}
    type : String
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
