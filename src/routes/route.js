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
const { authentication, authorisation } = require("../middleware/auth")


// ===========================================UserRoutes======================================================================

router.post('/authors', createAuthors)
router.get('/authors', getAuthor)
router.post('/login', authorLogin)

router.post('/blogs', authentication, createNewBlog)
router.get('/blogs', authentication, getBlogData)
router.put('/blogs/:blogId', authentication, authorisation, updateBlogData) 
router.delete('/blogs/:blogId', authentication, authorisation, deleteBlogs) 
 
module.exports = router;
