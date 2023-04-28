const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const  blogModel = require("../models/blogModel")

//Global Function
function isvalidObjectId(ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
}

//Authentication
const authentication = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send('Unauthorized');
    }
    const tokenCheck = authHeader.split(' ')[1];
    //Verifying
  
    jwt.verify(tokenCheck, process.env.Jwt_secret, (err, decode) => {
      if (err) {
        let msg =
          err.message == "jwt expired"
            ? "Token is Expired !!! "
            : "Token is Invalid !!!";

        return res.status(401).send({ status: false, msg: msg });
      }

      req["decode"] = decode.userId;

      next();
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      msg: "Server Error  authentication!!!",
      ErrMsg: err.message,
    });
  }
};

//Authorization

const authorization =  async function (req, res, next) {
  try {
    if (req.params) {
      if (!isvalidObjectId(req.params.blogId)) {
        return res
          .status(400)
          .send({ status: false, msg: "Not a valid UserId" });
      }
      
      const blogId = req.params.blogId
      const blog = await  blogModel.findById({ _id:blogId})
      if (blog.authorId == req.decode) {
        next();
      } else {
        return res
          .status(403)
          .send({ status: false, msg: "not Authorized User!!!" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "userId is require in params" });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      msg: "Server Error authorization !!!",
      err: err.message,
    });
  }
};


module.exports = {authentication,authorization}