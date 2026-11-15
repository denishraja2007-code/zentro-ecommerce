const jwt = require("jsonwebtoken");
const User = require("../models/User");

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const userData = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  token: makeToken(u._id),
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });
    res.status(201).json(userData(user));
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    res.json(userData(user));
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, currentPassword, newPassword } = req.body;

    if (name) user.name = name;

    if (newPassword) {
      if (!currentPassword)
        return res.status(400).json({ message: "Current password required" });
      if (!(await user.matchPassword(currentPassword)))
        return res.status(400).json({ message: "Current password is wrong" });
      if (newPassword.length < 6)
        return res.status(400).json({ message: "New password min 6 characters" });
      user.password = newPassword;
    }

    await user.save();
    res.json(userData(user));
  } catch (err) {
    next(err);
  }
};