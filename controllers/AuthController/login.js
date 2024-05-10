import bcrypt from "bcrypt";
import { User } from "../../models/user.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { sendCookie } from "../../utils/features.js";

config({
  path: ".env",
});

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    console.log("milgaya " + existingUser);

    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
    }

    sendCookie(existingUser, res, `Welcome back ${existingUser.name}`, 200);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Invalid email or password." });
  }
};

export { login };
