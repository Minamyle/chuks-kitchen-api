const users = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");

exports.signup = (req, res) => {
  const { email, phone, referralCode } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ message: "Email or phone required" });
  }

  const existingUser = users.find(
    (u) => u.email === email || u.phone === phone
  );

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const newUser = {
    id: uuidv4(),
    email: email || null,
    phone: phone || null,
    referralCode: referralCode || null,
    verified: false,
    otp: "1234", // simulated OTP
  };

  users.push(newUser);

  res.status(201).json({
    message: "User created. Verify with OTP.",
    userId: newUser.id,
  });
};

exports.verify = (req, res) => {
  const { userId, otp } = req.body;

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.verified = true;

  res.json({ message: "Account verified successfully" });
};
