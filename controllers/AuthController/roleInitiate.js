import User from '../../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config({
  path: ".env"
});

const roleIntiate = async (req, res) => {
  const { name, email, role, city } = req.body;
  try {
    const existingUserWithEmail = await User.findOne({ email: email });

    if (existingUserWithEmail) {
      if (existingUserWithEmail.role) {
        res.cookie("userRole", existingUserWithEmail.role, {
          expiresIn: new Date(Date.now() + 1000 * 60),
        });
        return res.status(201).json({ message: "User already has a role", role: true, existingUserWithEmail });
      } else {
        const user = await User.updateOne({ email: email }, { name: name, email: email, role: role, city: city });
        return res.status(201).json({ message: "Updated user info", role, user });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export {
  roleIntiate
};
