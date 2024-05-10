import User from '../../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config({
  path: ".env"
});

const LoginInitiate = async (req, res, next) => {
  // aborted this no need to implement this now
  try {
    const { email, name, } = req.body;
    const existingUserWithEmail = await User.find({ email: email });
    if (existingUserWithEmail.length > 0) {
      if (existingUserWithEmail.role) {
        res.cookie("userRole", existingUserWithEmail.role, {
          expiresIn: new Date(Date.now() + 1000 * 60),
        });
        return res.status(201).json({ message: "user have role", role: true, existingUserWithEmail })
      } else {
        return res.status(201).json({ message: "User don't have role ", role: false, existingUserWithEmail })
      }
    }
    else {
      let newUser = await User.create({ email, name });
      return res.status(201).json({ message: "User data is created", role: false, newUser, created: true })
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server Error", error })
  }
}

export {
  LoginInitiate
}