const PostsModel = require("../models/post.model");

class PostRepository {
     CreatePost = async (payload) => {
          const post = await PostsModel.create(payload);
          return post;
     };

     GetPostByEmail = async (email) => {
          const post = await PostsModel.findOne({ email });
          return post;
     };

     GetPosts = async () => {
          const posts = await PostsModel.aggregate([
               {
                    $match: {},
               },
               {
                    $lookup: {
                         from: "users",
                         localField: "author",
                         foreignField: "_id",
                         as: "author",
                    },
               },
          ]);
          return posts;
     };
     GetPostById = async (id) => {
          const post = await PostsModel.findById(id);
          return post;
     };

     UpdatePostById = async (id, payload) => {
          const post = await PostsModel.findOneAndUpdate(
               {
                    _id: id,
               },
               {
                    ...payload,
               },
               {
                    new: true,
               }
          );
          return post;
     };
}

const postRepo = new PostRepository();

module.exports = postRepo;
