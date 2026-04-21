import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import connectDB from "../lib/db.js";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token valid for 30 days
  });
};

// Register a new user
export const registerUser = async ({ name, email, password, role }) => {
  await connectDB(); // Ensure DB connection
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user in the database
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // return the token and user info (excluding password)
    return {
        token: generateToken(user._id, user.role),
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        }
    };
};

// Login user
export const loginUser = async ({ email, password }) => {
  await connectDB(); // Ensure DB connection

  // find user by email
  const user = await User.findOne ({ email }).select("+password"); // Include password for verification
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // compare plaintext password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // return the token and user info (excluding password)
    return {
        token: generateToken(user._id, user.role),
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        }
    };  
};