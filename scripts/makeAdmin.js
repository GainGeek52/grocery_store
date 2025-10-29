require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address.');
  console.error('Usage: node scripts/makeAdmin.js user@example.com');
  process.exit(1);
}

const run = async () => {
  await connectDB();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`No user found with email ${email}`);
      process.exit(1);
    }
    user.isAdmin = true;
    await user.save();
    console.log(`Successfully made ${email} an admin`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating user:', err);
    process.exit(1);
  }
};

run();