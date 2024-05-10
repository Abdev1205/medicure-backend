// import User from '../../models/user.js';
// import User from '../../models/user.js';
// import { User } from '../../models/user.js';
import {User} from "../../models/user.js"

import bcrypt from 'bcrypt';

const register = async (req, res, next) => {
  console.log(req.body)
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(
      {
        name: name,
        email: email,
        password: hashedPassword,
      }
    );
    await newUser.save();
    return res.status(201).json({ success: true, message: 'Registration successful.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.', error });
  }
}

export {
  register
}
