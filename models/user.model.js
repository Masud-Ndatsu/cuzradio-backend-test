const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
     {
          firstName: {
               type: String,
               required: true,
          },
          lastName: {
               type: String,
               required: true,
          },
          email: {
               type: String,
               required: true,
               unique: true,
               match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
          },
          password: {
               type: String,
               required: true,
          },
          role: {
               type: String,
               required: true,
               enum: ["admin", "moderator", "user"],
          },
          status: {
               type: String,
               default: "active",
               enum: ["inactive", "active"],
          },
     },
     {
          timestamps: true,
     }
);

UserSchema.methods.hasPermission = function (roles) {
     return roles.includes(this.role);
};

const UsersModel = model("users", UserSchema);

module.exports = UsersModel;
