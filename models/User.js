import mongoose from "mongoose";

const userSChema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, // Do not return password by default when querying users
  },
  role: {
    type: String,
    enum: ["Resident", "Municipal Staff", "Community Adovocate"],
    default: "Resident",
  },
  // Cool feature: tie users to specific geographic areas for more personalized experiences. 
  // Wont implement unless have time
  neighborhood: {
    type: String,
    trim: true,
  }
}, { timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", userSChema);

export default User;