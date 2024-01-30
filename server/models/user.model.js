import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  mail: String,
  title: String,
  image: String,
  favorite: Boolean,
});

const model = mongoose.models.User || mongoose.model("User", userSchema);
export default model;
