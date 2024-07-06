const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
     comparePassword,
     hashPassword,
     generateAccessToken,
} = require("../utils/encryption");
const userRepo = require("../repository/user.repository");
const {
     validateCreateUser,
     validateLoginUser,
     validateUpdateUserRole,
     validateChangeUserStatus,
} = require("../utils/validations/user");
const { formatValidationErrorMessage } = require("../utils/formatter");

const register = async (req, res) => {
     try {
          const {
               firstName,
               lastName,
               email,
               password,
               role = "user",
          } = req.body;
          const { error } = validateCreateUser(req.body);
          if (error) {
               return res.status(400).json({
                    status: false,
                    message: formatValidationErrorMessage(error.message),
                    data: null,
               });
          }
          const existingUser = await userRepo.GetUserByEmail(email);
          if (existingUser) {
               return res.status(400).json({
                    status: false,
                    data: null,
                    message: "User already exists",
               });
          }

          const hashedPassword = await hashPassword(password);
          await userRepo.createUser({
               firstName,
               lastName,
               email,
               password: hashedPassword,
               role,
          });
          return res.status(201).json({
               status: true,
               data: null,
               message: "User registered successfully",
          });
     } catch (error) {
          return res.status(500).json({
               status: false,
               data: null,
               message: error.message,
          });
     }
};

const login = async (req, res) => {
     try {
          const { email, password } = req.body;

          const { error } = validateLoginUser(req.body);
          if (error) {
               return res.status(400).json({
                    status: false,
                    message: formatValidationErrorMessage(error.message),
                    data: null,
               });
          }

          const user = await userRepo.GetUserByEmail(email);
          if (!user) {
               return res.status(400).json({
                    status: false,
                    data: null,
                    message: "Invalid email or password",
               });
          }

          const isPasswordValid = await comparePassword(
               password,
               user.password
          );
          if (!isPasswordValid) {
               return res.status(400).json({
                    status: false,
                    data: null,
                    message: "Invalid email or password",
               });
          }

          const token = generateAccessToken({ userId: user._id });

          return res.status(200).json({
               status: true,
               data: token,
               message: "Loggin successfully",
          });
     } catch (error) {
          return res.status(500).json({
               status: false,
               data: null,
               message: error.message,
          });
     }
};

const getProfile = async (req, res) => {
     try {
          const user = await userRepo.GetUserById(req.user._id);
          if (!user) {
               return res.status(404).json({
                    status: false,
                    data: null,
                    message: "User not found",
               });
          }

          return res.status(200).json({
               status: true,
               message: "Retrieved successfully",
               data: user,
          });
     } catch (error) {
          return res.status(500).json({
               status: false,
               data: null,
               message: error.message,
          });
     }
};

const getUsers = async (req, res) => {
     try {
          const users = await userRepo.GetUsers();

          return res.status(200).json({
               status: true,
               message: "Retrieved successfully",
               data: users,
          });
     } catch (error) {
          return res.status(500).json({
               status: false,
               data: null,
               message: error.message,
          });
     }
};

const changeUserStatus = async (req, res) => {
     const id = req.params.id;
     const { status } = req.body;

     try {
          const { error } = validateChangeUserStatus(req.body);
          if (error) {
               return res.status(400).json({
                    status: false,
                    message: formatValidationErrorMessage(error.message),
                    data: null,
               });
          }

          const user = await userRepo.GetUserById(id);
          if (!user) {
               return res.status(404).json({
                    status: false,
                    data: null,
                    message: "User not found!",
               });
          }

          if (user._id.equals(req.user._id)) {
               return res.status(400).json({
                    status: false,
                    data: null,
                    message: "Invalid operation: you can't deactivate yourself!",
               });
          }

          if (user.role === "admin" && req.user.role === "moderator") {
               return res.status(400).json({
                    status: false,
                    data: null,
                    message: "Invalid operation on an admin!",
               });
          }

          const isInActive = user.status === "inactive";

          if (isInActive && status === "inactive") {
               return res.status(400).json({
                    status: false,
                    data: null,
                    message: "User already deactivated!",
               });
          }

          await userRepo.UpdateUserById(id, { status });
          return res.status(200).json({
               status: true,
               message:
                    status === "inactive"
                         ? "Deactivated successfully"
                         : "Activated successfully",
               data: null,
          });
     } catch (error) {
          return res.status(500).json({
               status: false,
               data: null,
               message: error.message,
          });
     }
};

const updateUserRole = async (req, res) => {
     const payload = req.body;
     const id = req.params.id;
     try {
          const { error } = validateUpdateUserRole(payload);
          if (error) {
               return res.status(400).json({
                    status: false,
                    message: formatValidationErrorMessage(error.message),
                    data: null,
               });
          }

          const user = await userRepo.GetUserById(id);
          if (!user) {
               return res.status(404).json({
                    status: false,
                    data: null,
                    message: "User not found",
               });
          }

          if (
               user.status === "inactive" ||
               (user.role === "admin" && req.user.role === "moderator")
          ) {
               return res.status(400).json({
                    status: false,
                    data: null,
                    message: "Invalid operation on user account",
               });
          }
          await userRepo.UpdateUserById(id, { ...payload });
          return res.status(200).json({
               status: true,
               message: "Role updated successfully",
               data: null,
          });
     } catch (error) {
          return res.status(500).json({
               status: false,
               data: null,
               message: error.message,
          });
     }
};

const deleteUserAccount = async (req, res) => {
     const id = req.params.id;
     try {
          const user = await userRepo.GetUserById(id);
          if (!user) {
               return res.status(404).json({
                    status: false,
                    data: null,
                    message: "User not found",
               });
          }
          await userRepo.DeleteUserById(id);
          return res.status(200).json({
               status: true,
               message: "Account deleted successfully",
               data: null,
          });
     } catch (error) {
          return res.status(500).json({
               status: false,
               data: null,
               message: error.message,
          });
     }
};

module.exports = {
     register,
     login,
     getProfile,
     getUsers,
     changeUserStatus,
     updateUserRole,
     deleteUserAccount,
};
