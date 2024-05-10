import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config({
  path: ".env"
});

const logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie('accessToken', { expires: new Date(Date.now()) })
      .json({
        success: true,
        message: "User logout suceesully"
      });
  } catch (error) {
    res.status(400).json({ messsage: "User nor logged out", error })
  }
}

export {
  logout
}