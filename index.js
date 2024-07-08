const app = require("./app");
const { disconnectDB, connectDB } = require("./config/database");
const createUsers = require("./hooks/createUsers");

const port = process.env.PORT || 3000;

const server = app.listen(port, async () => {
     await connectDB();
     await createUsers();
     console.log("listening on port :", port);
});

// Properly handle termination signals to close open handles
const gracefulShutdown = async () => {
     console.log("Shutting down gracefully...");
     await disconnectDB(); // Ensure database connection is closed
     server.close(() => {
          console.log("Closed out remaining connections.");
          process.exit(0);
     });

     // Force close server after 10s if not closed already
     setTimeout(() => {
          console.error(
               "Could not close connections in time, forcefully shutting down"
          );
          process.exit(1);
     }, 10000);
};

// Listen for termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
