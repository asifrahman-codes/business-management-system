require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const connectDatabase = require("../config/db");
const User = require("../models/User.model");

const createAdmin = async () => {
  try {
    if (
      !process.env.ADMIN_NAME ||
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD
    ) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required"
      );
    }

    await connectDatabase();

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log(
        "A user with this email already exists."
      );
      process.exit(0);
    }

    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin account created successfully.");
    console.log(`Email: ${admin.email}`);

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to create admin:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();