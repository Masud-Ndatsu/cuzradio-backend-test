const { Router } = require("express");
const {
     createPost,
     getPosts,
     getPostById,
     updatePost,
     deletePost,
} = require("../controllers/post.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/", authenticate, createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);

module.exports = postRoutes = router;
