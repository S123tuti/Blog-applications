const express = require("express");
const router = express.Router();
const {
  createAuthors,
  getAuthor,
  authorLogin,
} = require("../controllers/authorController");
const {
  createNewBlog,
  getBlogData,
  updateBlogData,
  deleteBlogs,
} = require("../controllers/blogController");
 const {authentication,authorization} = require("../middleware/auth")


// ===========================================UserRoutes======================================================================

router.post('/authors', createAuthors)
router.get('/authors', getAuthor)
router.post('/login', authorLogin)

router.post('/blogs',authentication, createNewBlog)
router.get('/blogs', getBlogData)
router.put('/blogs/:blogId', authentication,authorization, updateBlogData) 
router.delete('/blogs/:blogId', authentication,authorization, deleteBlogs) 
 
module.exports = router;
