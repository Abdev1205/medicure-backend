import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config({
  path: ".env"
});

const refreshToken = async (req, res, next) => {
  // we will implemet this after all funcationlity is build no just increase cookit time
  const cookies = req.headers.cookie;
  console.log(cookies)
  const prevToken = cookies.split("=")[1];
  if (!prevToken) {
    res.status(400).json({ message: "Cannot find token" })
  }
  jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      response.status(403).json({ message: "Authentication failed" })
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h"
    })

    res.cookie(String(user._id), newToken, {
      path: '/',
      expiresIn: new Date(Date.now() + 1000 * 60),
      httpOnly: true,
      sameSite: 'lax'
    })

    req.id = user.id;
  })
  next();

}

export {
  refreshToken
}