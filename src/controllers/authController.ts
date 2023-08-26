import { Request, Response } from "express";
import User from "../models/authModel";
import { compare, loginToken, toHash } from "../utils/utils";
import { loginSchema, registerSchema } from "../utils/validator";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!isNaN(Number(username)) || !isNaN(Number(password))) {
      const { error } = registerSchema.validate({
        username: parseFloat(username),
        password: parseFloat(password),
      });
      if (error) {
        return res.status(400).send({
          success: false,
          message: error.details[0].message,
        });
      }
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(401).send({ message: "Username already exists" });
    }

    const hashedPassword = await toHash(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).send({
      status: "success",
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).send({ message: "An error occurred" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).send({
        success: false,
        message: error.details[0].message,
      });
    }

    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const isPasswordValid = await compare(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = loginToken((user?._id).toString());

    res.status(200).send({
      status: "success",
      message: "Login successful",
      token,
      user: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

export const getUSer = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ message: "You are not an authenticated user" });
    }

    return res
      .status(200)
      .send({ message: "User fetched successfully", data: user });
  } catch (error) {
    res.status(500).send({ message: "Error fetching user" });
  }
};
