import { User } from "../models/user.js";
import bcrypt from "bcrypt";

import { sendCookie } from "../utils/features.js";
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({
      success: true,
      users,
    });
  } catch (e) {
    console.log(e);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(404).json({
        success: false,
        message: "Invalid Email or Password",
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(404).json({
        success: false,
        message: "Invalid Email or Password",
      });

    sendCookie(user, res, `Welcome back ${user.name}`, 200);
    console.log("sent login cookie");
  } catch (error) {
    console.log(error);
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user)
    return res.status(404).json({
      success: false,
      message: "User already exists",
    });

  const hashedPass = await bcrypt.hash(password, 10);

  user = await User.create({ name, email, password: hashedPass });

  sendCookie(user, res, "Registered Succesfully", 201);
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", { expires: new Date(Date.now()) })
    .json({
      success: true,
    });
};
