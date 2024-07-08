const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const { connectDB, disconnectDB } = require("../config/database");
const { generateAccessToken, hashPassword } = require("../utils/encryption");
const UsersModel = require("../models/user.model");
const mongoose = require("mongoose");

beforeAll(async () => {
     await connectDB();
});

afterAll(async () => {
     await disconnectDB();
});

describe("User Controller Tests", () => {
     let token;
     let userMock, userMock2;

     beforeEach(async () => {
          userMock = new UsersModel({
               firstName: "John",
               lastName: "Doe",
               email: "john.doe@example.com",
               password: await hashPassword("password123"),
               role: "admin",
               status: "active",
          });
          userMock2 = new UsersModel({
               firstName: "John",
               lastName: "Doe",
               email: "john.doe2@example.com",
               password: await hashPassword("password123"),
               role: "user",
               status: "active",
          });
          await userMock.save();
          await userMock2.save();
          token = generateAccessToken({ userId: userMock._id });
     });

     afterEach(async () => {
          await UsersModel.deleteMany({});
     });

     describe("POST /register", () => {
          it("should register a new user", async () => {
               const response = await request(app)
                    .post("/api/users/register")
                    .send({
                         firstName: "Jane",
                         lastName: "Doe",
                         email: "jane.doe@example.com",
                         password: "password123",
                         role: "user",
                    });

               expect(response.statusCode).toBe(201);
               expect(response.body.message).toBe(
                    "User registered successfully"
               );
          });

          it("should not register a user if email already exists", async () => {
               const response = await request(app)
                    .post("/api/users/register")
                    .send({
                         firstName: "Jane",
                         lastName: "Doe",
                         email: "john.doe@example.com",
                         password: "password123",
                         role: "user",
                    });

               expect(response.statusCode).toBe(400);
               expect(response.body.message).toBe("User already exists");
          });
     });

     describe("POST /login", () => {
          it("should login a user", async () => {
               const response = await request(app)
                    .post("/api/users/login")
                    .send({
                         email: "john.doe@example.com",
                         password: "password123",
                    });

               expect(response.statusCode).toBe(200);
               expect(response.body.message).toBe("Loggin successfully");
          });

          it("should not login a user with invalid email", async () => {
               const response = await request(app)
                    .post("/api/users/login")
                    .send({
                         email: "nonexistent@example.com",
                         password: "password123",
                    });

               expect(response.statusCode).toBe(400);
               expect(response.body.message).toBe("Invalid email or password");
          });
     });

     describe("GET /profile", () => {
          it("should get user profile", async () => {
               const response = await request(app)
                    .get("/api/users/profile")
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(200);
               expect(response.body.message).toBe("Retrieved successfully");
               expect(response.body.data.email).toBe(userMock.email);
          });

          it("should return 401 if user not found", async () => {
               await UsersModel.deleteMany({});
               const response = await request(app)
                    .get("/api/users/profile")
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(401);
               expect(response.body.message).toBe("Unauthorized");
          });
     });

     describe("GET /", () => {
          it("should get all users", async () => {
               const response = await request(app)
                    .get("/api/users")
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(200);
               expect(response.body.message).toBe("Retrieved successfully");
               expect(response.body.data.length).toBeGreaterThan(0);
          });
     });

     describe("PUT /:id/change-status", () => {
          it("should change user status", async () => {
               const userId = userMock2._id.toString();
               const response = await request(app)
                    .put(`/api/users/${userId}/change-status`)
                    .send({ status: "inactive" })
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(200);
               expect(response.body.message).toBe("Deactivated successfully");
               const updatedUser = await UsersModel.findById(userId);
               expect(updatedUser.status).toBe("inactive");
          });

          it("should return 404 if user not found", async () => {
               const response = await request(app)
                    .put(
                         `/api/users/${new mongoose.Types.ObjectId()}/change-status`
                    )
                    .send({ status: "inactive" })
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(404);
               expect(response.body.message).toBe("User not found!");
          });

          it("should return 403 if user does not have permission", async () => {
               userMock.role = "user";
               await userMock.save();
               token = generateAccessToken({ userId: userMock._id });

               const response = await request(app)
                    .put(`/api/users/${userMock._id}/change-status`)
                    .send({ status: "inactive" })
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(403);
               expect(response.body.message).toBe("Forbidden");
          });
     });

     describe("PUT /:id/change-role", () => {
          it("should update user role", async () => {
               const userId = userMock._id.toString();
               const response = await request(app)
                    .put(`/api/users/${userId}/change-role`)
                    .send({ role: "admin" })
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(200);
               expect(response.body.message).toBe("Role updated successfully");
               const updatedUser = await UsersModel.findById(userId);
               expect(updatedUser.role).toBe("admin");
          });

          it("should return 404 if user not found", async () => {
               const response = await request(app)
                    .put(
                         `/api/users/${new mongoose.Types.ObjectId()}/change-role`
                    )
                    .send({ role: "admin" })
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(404);
               expect(response.body.message).toBe("User not found");
          });

          it("should return 403 if user does not have permission", async () => {
               userMock.role = "user";
               await userMock.save();
               token = generateAccessToken({ userId: userMock._id });

               const response = await request(app)
                    .put(`/api/users/${userMock._id}/change-role`)
                    .send({ role: "admin" })
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(403);
               expect(response.body.message).toBe("Forbidden");
          });
     });

     describe("DELETE /:id", () => {
          it("should delete user account", async () => {
               const userId = userMock._id.toString();
               const response = await request(app)
                    .delete(`/api/users/${userId}`)
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(200);
               expect(response.body.message).toBe(
                    "Account deleted successfully"
               );
               const deletedUser = await UsersModel.findById(userId);
               expect(deletedUser).toBeNull();
          });

          it("should return 404 if user not found", async () => {
               const response = await request(app)
                    .delete(`/api/users/${new mongoose.Types.ObjectId()}`)
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(404);
               expect(response.body.message).toBe("User not found");
          });

          it("should return 403 if user does not have permission", async () => {
               userMock.role = "moderator";
               await userMock.save();
               token = generateAccessToken({ userId: userMock._id });

               const response = await request(app)
                    .delete(`/api/users/${userMock._id}`)
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(403);
               expect(response.body.message).toBe("Forbidden");
          });
     });
});
