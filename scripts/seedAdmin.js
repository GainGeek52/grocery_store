require('dotenv').config();
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env');
    process.exit(1);
  }

  try {
    const existing = await User.findOne({ email });
    const hash = await bcrypt.hash(password, 10);
    if (existing) {
      existing.password = hash;
      existing.isAdmin = true;
      await existing.save();
      console.log(`Updated existing user ${email} as admin`);
    } else {
      const user = new User({ name: 'Admin', email, password: hash, isAdmin: true });
      await user.save();
      console.log(`Created admin user ${email}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user', err);
    process.exit(1);
  }
};

run();
