const PostsModel = require("../models/post.model");
const postRepo = require("../repository/post.repository");
const { formatValidationErrorMessage } = require("../utils/formatter");
const {
     validateCreatePostSchema,
     validateUpdatePostSchema,
} = require("../utils/validations/post");

const createPost = async (req, res) => {
     try {
          const { error } = validateCreatePostSchema(req.body);
          if (error) {
               return res.status(400).json({
                    status: false,
                    message: formatValidationErrorMessage(error.message),
                    data: null,
               });
          }
          const { title, content, tags, status } = req.body;
          const post = await postRepo.CreatePost({
               title,
               content,
               author: req.user._id,
               tags,
               status,
          });

          return res.status(201).json({
               status: true,
               message: "Created successfully",
               data: post,
          });
     } catch (error) {
          console.log("error[createPost]", error);

          return res.status(500).json({
               status: false,
               message: "Internal Server Error",
               data: null,
          });
     }
};

const getPosts = async (req, res) => {
     try {
          const posts = await PostsModel.find().populate(
               "author",
               "firstName lastName email"
          );
          return res.status(200).json({
               status: true,
               message: "Retrieved successfully",
               data: posts,
          });
     } catch (error) {
          console.log("error[getPosts]", error);
          return res.status(500).json({
               status: false,
               message: "Internal Server Error",
               data: null,
          });
     }
};

const getPostById = async (req, res) => {
     try {
          const post = await PostsModel.findById(req.params.id).populate(
               "author",
               "firstName lastName email"
          );

          if (!post) {
               return res.status(400).json({
                    status: false,
                    message: "Post not found",
                    data: null,
               });
          }

          await post.incrementViews();

          return res.status(200).json({
               status: true,
               message: "Retrieved successfully",
               data: post,
          });
     } catch (error) {
          return res.status(500).json({
               status: false,
               message: "Internal Server Error",
               data: null,
          });
     }
};

const updatePost = async (req, res) => {
     try {
          const id = req.params.id;
          const { title, content, tags, status } = req.body;

          const { error } = validateUpdatePostSchema(req.body);

          if (error) {
               return res.status({
                    status: false,
                    message: formatValidationErrorMessage(error.message),
                    data: null,
               });
          }
          const post = await postRepo.GetPostById(id);

          if (!post) {
               return res.status(404).json({
                    status: false,
                    message: "Post not found",
                    data: null,
               });
          }

          if (post.author._id.toString() !== req.user._id.toString()) {
               return res.status(400).json({
                    status: false,
                    message: "Invalid: You can't edit this post",
                    data: null,
               });
          }

          await postRepo.UpdatePostById(id, {
               title: title || post.title,
               content: content || post.content,
               tags: tags || post.tags,
               status: status || post.status,
          });

          return res.status(200).json({
               status: true,
               message: "Updated successfully",
               data: null,
          });
     } catch (error) {
          console.log("error[updatePostById]", error);

          return res.status(500).json({
               status: false,
               message: "Internal Server Error",
               data: null,
          });
     }
};

const deletePost = async (req, res) => {
     try {
          const postId = req.params.id;

          const post = await PostsModel.findById(postId);

          if (!post) {
               return res.status(404).json({
                    status: false,
                    message: "Post not found",
                    data: null,
               });
          }

          await PostsModel.findOneAndDelete({ _id: postId });

          return res.status(200).json({
               status: true,
               message: "Deleted successfully",
               data: null,
          });
     } catch (error) {
          console.log("error[deletePostById]", error);
          return res.status(500).json({
               status: false,
               message: "Internal Server Error",
               data: null,
          });
     }
};

module.exports = {
     createPost,
     getPosts,
     getPostById,
     updatePost,
     deletePost,
};
