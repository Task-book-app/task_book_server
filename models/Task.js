import mongoose from "mongoose";
const { Schema, model } = mongoose;

const taskSchema = new Schema(
  {
    task: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    priority: { type: Number, min: 1, max: 4, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Task = model("Task", taskSchema);

export default Task;
