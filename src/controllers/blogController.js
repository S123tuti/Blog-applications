const blogModel = require("../models/blogModel");
const authorModel = require("../models/authormodel");
const mongoose = require("mongoose");
const uploadFile = require("../awsconfig/aws");
const {blogValidator,updateBlog} = require("../validator/valid")

//--------------------------------------------POST /blogs---------------------------------------------------

const createNewBlog = async function (req, res) {
  try {
    let blogData = req.body;
    const files = req.files;
    let data = {};
 
    data.title = blogData.title;
    data.content = blogData.content;
   
   
    if (files && files.length > 0) {
      data.image = await uploadFile(files[0]); 
    }
    data.authorId = req.body.authorId;
  
    
    if(!blogData.isDeleted){
       data.isDeleted= false
    }
     console.log(req.body)
    const { error, value } = blogValidator.validate(data);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    let authorId = await authorModel.findById(value.authorId);
    if (!authorId) {
      return res
        .status(404)
        .send({ status: false, msg: "Author doesn't exist" });
    }
    if (!(blogData.authorId == req.decode)) {
      return res
      .status(403)
      .send({
        status: false,
        msg: "author loggedIn is not allowed to create other author blogs",
      });
    }

    let blogCreated = await blogModel.create(value);
    return res
    .status(201)
    .send({
      status: true,
      message: "Blog created sucessfully",
      data: blogCreated,
    });
  } catch (error) {
    return res
    .status(500)
    .send({ status: false, Error: error.message });
  }
};

//------------------------------------------------ GET /blogs ------------------------------------------------------

const getBlogData = async function (req, res) {
  try {
    const queryData = req.query;
    //====================================== if data is not entered in queryparams ====================================
    if (Object.keys(queryData).length == 0) {
      const blog = await blogModel.find({ isDeleted: false });
      if (blog.length == 0) {
        return res
          .status(404)
          .send({ status: false, msg: "Blog doesn't Exists." });
      }
      return res
      .status(200)
      .send({ status: true, data: blog });
    }
    //======================================= if data is entered in queryparams ======================================
    if (Object.keys(queryData).length !== 0) {
      let getBlog = await blogModel
        .find({ $and: [{ isDeleted: false }, queryData] })
        .populate("authorId");
      if (getBlog.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "No such blog exist.Please provide correct data",
        });
      }
      return res
      .status(200)
      .send({ status: true, data: getBlog });
    }
  } catch (error) {
    return res
    .status(500)
    .send({ status: false, Error: error.message });
  }
};

//------------------------------------------PUT /blogs/:blogId ---------------------------------------------------

const updateBlogData = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    const { title, content } = req.body;
    const file = req.files;
    const data = {};
    //==================================== if data is not entered ==================================
    if (Object.keys(req.body).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter Data to be updated" });
    }
    
    if (title) {
      data.title = title;
    }

    if (content) {
      data.content = content;
    }
   
    if (file && file.length > 0) {
      let profileImage = await uploadFile(file[0]); //uploading file to aws s3
      data.Image = profileImage;
    }
     const { error,value}= updateBlog.validate(data)
     if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    //====================================== updating data =========================================
    let blog = await blogModel.findOneAndUpdate(
      { _id: blogId },
      {
        $set: { value },
      },
      { new: true }
    );
    //==================== if get null or blog not found or blog is deleted =============================================
  
    if (!blog) {
      return res
        .status(404)
        .send({ status: false, msg: "The blog is deleted" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Blog update is successful", data: blog });
  } catch (error) {
    return res
    .status(500)
    .send({ status: false, Error: error.message });
  }
};

//------------------------------------------- DELETE /blogs/:blogId --------------------------------------------

const deleteBlogs = async function (req, res) {
  try {
    let blogIdData = req.params.blogId;
    let blog = await blogModel.findById(blogIdData);
    if (blog.isDeleted === true)
      return res
        .status(404)
        .send({ status: true, message: "blog is not exist" });
    //=============================== if blog is not deleted and want to delete it ====================
   await blogModel.findOneAndUpdate(
      { _id: blogIdData },
    { $set:{ isDeleted: true}},
      {new:true}
    );
    return res
      .status(200)
      .send({ status: true, msg: "Data is successfully deleted" });
  } catch (error) {
    return res.status(500).send({ status: false, Error: error.message });
  }
};


module.exports = { createNewBlog, getBlogData, updateBlogData, deleteBlogs };
