import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first: String,
  last: String,
  twitter: String,
  avatar: String,
  favorite: Boolean,
});

const model =
  mongoose.models.contacts || mongoose.model("contacts", userSchema);
export default model;
