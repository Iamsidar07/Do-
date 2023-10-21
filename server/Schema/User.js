import { Schema, model, models } from "mongoose";
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
  },
  image: {
    type: String,
    required: [true, "image is required"],
  },
  password: {
    type: String,
    default: "Xedmsdoahkjr",
  },
});

export const User = models.User || model("User", UserSchema);

export default User;
