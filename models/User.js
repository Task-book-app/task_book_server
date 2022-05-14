import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = model("User", userSchema);

export default User;
