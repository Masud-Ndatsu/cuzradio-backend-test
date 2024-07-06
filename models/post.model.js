const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const schema = new Schema(
     {
          title: {
               type: String,
               required: true,
          },
          content: {
               type: String,
               required: true,
          },
          author: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "users",
               required: true,
          },
          tags: {
               type: [String], // Array of tags
               default: [],
          },
          status: {
               type: String,
               enum: ["draft", "published", "archived"],
               default: "draft",
          },
          views: {
               type: Number,
               default: 0,
          },
     },
     { timestamps: true }
);

schema.methods.incrementViews = async function () {
     this.views += 1;
     return await this.save();
};

schema.statics.findByStatus = async function (status) {
     return await this.find({ status });
};

schema.statics.findByTag = async function (tag) {
     return await this.find({ tags: tag });
};

const PostsModel = model("posts", schema);

module.exports = PostsModel;
