import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true
});

userSchema.virtual("myTasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

const User = mongoose.model("User", userSchema);
export default User;
