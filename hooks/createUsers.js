const bcrypt = require("bcrypt");
const UsersModel = require("../models/user.model");

async function createUsers() {
     try {
          const hashedPassword = await bcrypt.hash("securepassword", 10);
          // Create a new admin user
          await UsersModel.findOneAndUpdate(
               { email: "admin@example.com" },
               {
                    firstName: "Admin",
                    lastName: "User",
                    email: "admin@example.com",
                    password: hashedPassword,
                    role: "admin",
               },
               {
                    upsert: true,
                    new: true,
               }
          );

          // Create a new manager user
          await UsersModel.findOneAndUpdate(
               { email: "moderator@example.com" },
               {
                    firstName: "Manager",
                    lastName: "User",
                    email: "moderator@example.com",
                    password: hashedPassword,
                    role: "moderator",
               },
               { upsert: true, new: true }
          );

          // Create a new regular user
          await UsersModel.findOneAndUpdate(
               { email: "user@example.com" },
               {
                    firstName: "Regular",
                    lastName: "User",
                    email: "user@example.com",
                    password: hashedPassword,
                    role: "user",
               },
               {
                    upsert: true,
                    new: true,
               }
          );

          console.log("Users created successfully");
     } catch (error) {
          console.error("Error creating users:", error);
     }
}

module.exports = createUsers;
