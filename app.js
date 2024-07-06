require("dotenv/config");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");
const hpp = require("hpp");
const { connectDB } = require("./config/database");
const createUsers = require("./hooks/createUsers");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(express.json({ limit: "20mb" }));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(hpp());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
     return res.status(200).json({ message: "Cuzradio Blog API is Live" });
});

app.use("/api/users", require("./routes/user.route"));
app.use("/api/posts", require("./routes/post.route"));

app.use((req, res) => {
     return res.status(404).json({
          status: false,
          message: "Routes not found",
          data: null,
     });
});

app.use((err, req, res) => {
     if (
          err instanceof SyntaxError &&
          err.name === "SyntaxError" &&
          "body" in err
     ) {
          return res.status(400).json({
               status: false,
               message: "Invalid JSON format",
               data: null,
          });
     } else {
          return res.status(500).json({
               status: false,
               message: "Internal Server Error",
               data: null,
          });
     }
});

app.listen(port, async () => {
     connectDB();
     createUsers();
     console.log("listening on port :", port);
});
