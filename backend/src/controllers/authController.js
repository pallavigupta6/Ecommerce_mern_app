import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/user.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};

const createUser = async (payload, role = "customer") => {
  const { name, address, mobileNumber, dateOfBirth, email, password } = payload;

  // Create user
  const user = await User.create({
    name,
    address,
    mobileNumber,
    dateOfBirth,
    email,
    password,
    role,
  });

  return user;
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already exists
    const userExists = await User.findOne({
      mobileNumber: req.body.mobileNumber,
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = createUser(req.body);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already exists
    const userExists = await User.findOne({
      mobileNumber: req.body.mobileNumber,
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = createUser(req.body, "admin");

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    const user = await User.findOne({ mobileNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: "Invalid mobile number or password" });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
