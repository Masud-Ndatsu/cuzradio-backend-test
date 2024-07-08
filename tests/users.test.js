const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const userRepo = require("../repository/user.repository");
const { connectDB, disconnectDB } = require("../config/database");

jest.mock("../repository/user.repository");

beforeAll(async () => {
     await connectDB();
});
let token;
afterAll(async () => {
     await disconnectDB();
});

describe("User Controller Tests", () => {
     describe("POST /register", () => {
          it("should register a new user", async () => {
               userRepo.GetUserByEmail.mockResolvedValue(null);
               userRepo.createUser.mockResolvedValue(true);

               const response = await request(app)
                    .post("/api/users/register")
                    .send({
                         firstName: "John",
                         lastName: "Doe",
                         email: "john.doe@example.com",
                         password: "password123",
                         role: "admin",
                    });

               expect(response.statusCode).toBe(201);
               expect(response.body.message).toBe(
                    "User registered successfully"
               );
          });

          it("should not register a user if email already exists", async () => {
               userRepo.GetUserByEmail.mockResolvedValue({
                    email: "john.doe@example.com",
               });

               const response = await request(app)
                    .post("/api/users/register")
                    .send({
                         firstName: "John",
                         lastName: "Doe",
                         email: "john.doe@example.com",
                         password: "password123",
                         role: "admin",
                    });

               expect(response.statusCode).toBe(400);
               expect(response.body.message).toBe("User already exists");
          });
     });

     describe("POST /login", () => {
          it("should login a user", async () => {
               const hashedPassword = await bcrypt.hash("password123", 10);
               userRepo.GetUserByEmail.mockResolvedValue({
                    _id: "userId",
                    email: "john.doe@example.com",
                    password: hashedPassword,
               });

               const response = await request(app)
                    .post("/api/users/login")
                    .send({
                         email: "john.doe@example.com",
                         password: "password123",
                    });
               console.log(response.body);
               token = response.body.data;
               expect(response.statusCode).toBe(200);
               expect(response.body.message).toBe("Loggin successfully");
          });

          it("should not login a user with invalid email", async () => {
               userRepo.GetUserByEmail.mockResolvedValue(null);

               const response = await request(app)
                    .post("/api/users/login")
                    .send({
                         email: "john.doe@example.com",
                         password: "password123",
                    });

               expect(response.statusCode).toBe(400);
               expect(response.body.message).toBe("Invalid email or password");
          });
     });

     describe("GET /profile", () => {
          it("should get user profile", async () => {
               userRepo.GetUserById.mockResolvedValue({
                    _id: "userId",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    role: "admin",
               });

               const response = await request(app)
                    .get("/api/users/profile")
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(200);
               expect(response.body.message).toBe("Retrieved successfully");
          });

          it("should return 404 if user not found", async () => {
               userRepo.GetUserById.mockResolvedValue(null);

               const response = await request(app)
                    .get("/api/users/profile")
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(404);
               expect(response.body.message).toBe("User not found");
          });
     });

     describe("GET /users", () => {
          it("should get all users", async () => {
               userRepo.GetUsers.mockResolvedValue([
                    { _id: "userId1", email: "john.doe1@example.com" },
                    { _id: "userId2", email: "john.doe2@example.com" },
               ]);

               const response = await request(app)
                    .get("/api/users")
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(200);
               expect(response.body.message).toBe("Retrieved successfully");
          });
     });

     describe("PUT /user/:id/change-status", () => {
          it("should change user status", async () => {
               userRepo.GetUserById.mockResolvedValue({
                    _id: "userId",
                    status: "active",
                    role: "user",
               });

               const response = await request(app)
                    .put("/api/users/userId/change-status")
                    .send({ status: "inactive" })
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(200);
               expect(response.body.message).toBe("Deactivated successfully");
          });

          it("should return 404 if user not found", async () => {
               userRepo.GetUserById.mockResolvedValue(null);

               const response = await request(app)
                    .put("/api/users/userId/change-status")
                    .send({ status: "inactive" })
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(404);
               expect(response.body.message).toBe("User not found!");
          });
     });

     describe("PUT /users/:id/change-role", () => {
          it("should update user role", async () => {
               userRepo.GetUserById.mockResolvedValue({
                    _id: "userId",
                    role: "user",
                    status: "active",
               });

               const response = await request(app)
                    .put("/api/users/userId/change-role")
                    .send({ role: "admin" })
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(200);
               expect(response.body.message).toBe("Role updated successfully");
          });

          it("should return 404 if user not found", async () => {
               userRepo.GetUserById.mockResolvedValue(null);

               const response = await request(app)
                    .put("/api/users/userId/change-role")
                    .send({ role: "admin" })
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(404);
               expect(response.body.message).toBe("User not found");
          });
     });

     describe("DELETE /users/:id", () => {
          it("should delete user account", async () => {
               userRepo.GetUserById.mockResolvedValue({
                    _id: "userId",
                    email: "john.doe@example.com",
               });

               const response = await request(app)
                    .delete("/api/users/userId")
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(200);
               expect(response.body.message).toBe(
                    "Account deleted successfully"
               );
          });

          it("should return 404 if user not found", async () => {
               userRepo.GetUserById.mockResolvedValue(null);

               const response = await request(app)
                    .delete("/api/users/userId")
                    .set("Authorization", `Bearer ${token}`);

               expect(response.statusCode).toBe(404);
               expect(response.body.message).toBe("User not found");
          });
     });
});
