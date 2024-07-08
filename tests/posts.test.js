const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // Assume app is the Express application
const PostsModel = require("../models/post.model");
const UsersModel = require("../models/user.model");
const { generateAccessToken } = require("../utils/encryption"); // Assume generateAccessToken is a function to create JWT tokens
const { connectDB, disconnectDB } = require("../config/database");

// Mock user for authentication
const mockUser = {
     _id: new mongoose.Types.ObjectId(),
     firstName: "John",
     lastName: "Doe",
     email: "john.doe@example.com",
     password: "password123",
     role: "user",
};

let token;

beforeAll(async () => {
     await connectDB();
     await UsersModel.create(mockUser);
     token = generateAccessToken({ userId: mockUser._id });
});

afterAll(async () => {
     await UsersModel.deleteMany({});
     await PostsModel.deleteMany({});
     await disconnectDB();
});

describe("Post Controller", () => {
     describe("POST /posts", () => {
          it("should create a post", async () => {
               const response = await request(app)
                    .post("/api/posts")
                    .set("Authorization", `Bearer ${token}`)
                    .send({
                         title: "Test Post",
                         content: "This is a test post",
                         tags: ["test"],
                         status: "published",
                    });

               expect(response.status).toBe(201);
               expect(response.body.status).toBe(true);
               expect(response.body.message).toBe("Created successfully");
               expect(response.body.data.title).toBe("Test Post");
          });

          it("should return validation error", async () => {
               const response = await request(app)
                    .post("/api/posts")
                    .set("Authorization", `Bearer ${token}`)
                    .send({});

               expect(response.status).toBe(400);
               expect(response.body.status).toBe(false);
               expect(response.body.message).toBeDefined();
          });
     });

     describe("GET /posts", () => {
          it("should get all posts", async () => {
               const response = await request(app)
                    .get("/api/posts")
                    .set("Authorization", `Bearer ${token}`);

               expect(response.status).toBe(200);
               expect(response.body.status).toBe(true);
               expect(response.body.message).toBe("Retrieved successfully");
               expect(response.body.data).toBeInstanceOf(Array);
          });
     });

     describe("GET /posts/:id", () => {
          let postId;

          beforeAll(async () => {
               const post = await PostsModel.create({
                    title: "Test Post",
                    content: "This is a test post",
                    author: mockUser._id,
                    tags: ["test"],
                    status: "published",
               });
               postId = post._id;
          });

          it("should get post by ID", async () => {
               const response = await request(app)
                    .get(`/api/posts/${postId}`)
                    .set("Authorization", `Bearer ${token}`);

               expect(response.status).toBe(200);
               expect(response.body.status).toBe(true);
               expect(response.body.message).toBe("Retrieved successfully");
               expect(response.body.data._id).toBe(postId.toString());
          });

          it("should return 404 if post not found", async () => {
               const response = await request(app)
                    .get(`/api/posts/${new mongoose.Types.ObjectId()}`)
                    .set("Authorization", `Bearer ${token}`);

               expect(response.status).toBe(400);
               expect(response.body.status).toBe(false);
               expect(response.body.message).toBe("Post not found");
          });
     });

     describe("PUT /posts/:id", () => {
          let postId;

          beforeAll(async () => {
               const post = await PostsModel.create({
                    title: "Test Post",
                    content: "This is a test post",
                    author: mockUser._id,
                    tags: ["test"],
                    status: "published",
               });
               postId = post._id;
          });

          it("should update a post", async () => {
               const response = await request(app)
                    .put(`/api/posts/${postId}`)
                    .set("Authorization", `Bearer ${token}`)
                    .send({
                         title: "Updated Test Post",
                         content: "This is an updated test post",
                    });

               expect(response.status).toBe(200);
               expect(response.body.status).toBe(true);
               expect(response.body.message).toBe("Updated successfully");
          });

          it("should return 404 if post not found", async () => {
               const response = await request(app)
                    .put(`/api/posts/${new mongoose.Types.ObjectId()}`)
                    .set("Authorization", `Bearer ${token}`)
                    .send({
                         title: "Updated Test Post",
                         content: "This is an updated test post",
                    });

               expect(response.status).toBe(404);
               expect(response.body.status).toBe(false);
               expect(response.body.message).toBe("Post not found");
          });
     });

     describe("DELETE /posts/:id", () => {
          let postId;

          beforeAll(async () => {
               const post = await PostsModel.create({
                    title: "Test Post",
                    content: "This is a test post",
                    author: mockUser._id,
                    tags: ["test"],
                    status: "published",
               });
               postId = post._id;
          });

          it("should delete a post", async () => {
               const response = await request(app)
                    .delete(`/api/posts/${postId}`)
                    .set("Authorization", `Bearer ${token}`);

               expect(response.status).toBe(200);
               expect(response.body.status).toBe(true);
               expect(response.body.message).toBe("Deleted successfully");
          });

          it("should return 404 if post not found", async () => {
               const response = await request(app)
                    .delete(`/api/posts/${new mongoose.Types.ObjectId()}`)
                    .set("Authorization", `Bearer ${token}`);

               expect(response.status).toBe(404);
               expect(response.body.status).toBe(false);
               expect(response.body.message).toBe("Post not found");
          });
     });
});
