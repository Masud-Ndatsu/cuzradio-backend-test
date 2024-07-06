const mongoose = require("mongoose");

const DB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cuzradio";
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

module.exports = { connectDB };
