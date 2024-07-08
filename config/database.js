const mongoose = require("mongoose");
const env = process.env.NODE_ENV;
const DB_URI =
     env === "prod"
          ? process.env.MONGODB_URI_PROD
          : env === "test"
          ? process.env.MONGODB_URI_TEST
          : process.env.MONGODB_URI || "mongodb://localhost:27017/cuzradio";
const connectDB = async () => {
     try {
          await mongoose.connect(DB_URI).then(() => {
               console.log("Database connected");
          });
     } catch (error) {
          console.log(
               error.message,
               "error occured while connecting to mongoose"
          );
     }
};

const disconnectDB = async () => {
     try {
          await mongoose.connection.close();
          console.log("MongoDB disconnected successfully.");
     } catch (err) {
          console.error("MongoDB disconnection error:", err);
     }
};

module.exports = { connectDB, disconnectDB };
