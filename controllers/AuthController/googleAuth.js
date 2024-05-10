import passport from '../../utils/passportConfig.js';
import User from '../../models/user.js';
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config({
  path: ".env"
});
let userData;
const googleAuth = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] }, (err, user, info) => {
    if (err || !user) {
      console.log("1st error", err)
      return res.status(500).json({ success: false, message: 'Google authentication failed.', err: err, user: user, info: info });
    }
    console.log("user dat ain gauth", user);

    const tokenPayload = {
      id: user.user?._id || user?.existingUserWithEmail?._id,
    };
    console.log("this is token payload ", tokenPayload)

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h'
    });

    var redirectParam = req.query.redirect;
    if (user?.user?.role === undefined || user?.user?.role.trim() === "") {
      redirectParam = "/role"
    }
    else if (user?.user?.role === "public") {
      redirectParam = "/user"
    }
    else {
      redirectParam = `/${user.user?.role}`
    }
    const redirectURL = redirectParam && redirectParam.length > 0
      ? `http://localhost:3000${redirectParam}?success=true`
      : `http://localhost:3000/?success=true`;

    console.log("redirect url", redirectURL, "rediect param", redirectParam);
    res.cookie("accessToken", token, {
      expiresIn: new Date(Date.now() + 1000 * 60),
    });
    console.log(" i am before rediect return brefore")

    return res.redirect(redirectURL);
  })(req, res, next);
};

export {
  googleAuth
}