import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const brandSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});



export default mongoose.model("Brand", brandSchema);
