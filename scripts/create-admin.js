const { Command } = require("commander");
const bcrypt = require("bcrypt");
const { connectDB, disconnectDB } = require("../config/database");
const UsersModel = require("../models/user.model");

const program = new Command();

program
     .name("admin-cli")
     .description("CLI to manage admin users and roles")
     .version("1.0.0");

program
     .command("create-admin")
     .option("--firstName <firstName>", "Admin first name")
     .option("--lastName <lastName>", "Admin last name")
     .option("--email <email>", "Admin email")
     .option("--password <password>", "Admin password")
     .option("--role <role>", "Role name")
     .action(async (cmd) => {
          await connectDB();
          try {
               const { firstName, lastName, email, password, role } = cmd;

               if (!firstName || !lastName || !email || !password || !role) {
                    console.error(
                         "All fields (firstName, lastName, email, password, role) are required."
                    );
                    await disconnectDB();
                    return;
               }
               const hashedPassword = await bcrypt.hash(password, 10);

               const newUser = await UsersModel.create({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    role,
               });
               console.log("Admin user created:", newUser.toJSON());

               console.log(
                    `Role '${newUser.role}' assigned to user '${newUser.email}'`
               );
          } catch (error) {
               console.error("Error creating admin user:", error.message);
          } finally {
               await disconnectDB();
          }
     });
program.parse(process.argv);
