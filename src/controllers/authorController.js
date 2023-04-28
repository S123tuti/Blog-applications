const authorModel = require("../models/authormodel");
const jwt = require("jsonwebtoken");
const  bcrypt = require("bcrypt")
const { authorValidator, validLogin } = require("../validator/valid");

//-------------------------------------------------- APIs /authors --------------------------------

const createAuthors = async function (req, res) {
  try {
    //=========================================== user not entered any data ==========================================
    let authorData = req.body;
    if (Object.keys(authorData).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "please enter data" });
    }
    const { error, value } = authorValidator.validate(authorData);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    let emailAlreadyExist = await authorModel.findOne({ email: value.email });
    if (emailAlreadyExist) {
      return res
        .status(400)
        .send({ status: false, message: "Email already exist." });
    }
    const saltRounds = 10; 
    const encryptedPassword = await bcrypt.hash(authorData.password, saltRounds);
  
    
    let createdAuthor = await  new authorModel({
      fname: value.fname,
      lname: value.lname,
      title: value.title,
      email: value.email,
      password: encryptedPassword
      
    });
    await createdAuthor.save()
    return res
      .status(201)
      .send({
        status: true,
        message: "Author created sucessfully",
        data: createdAuthor,
      });
  } catch (error) {
    return res.status(500).send({ status: false, Error: error.message });
  }
};

//--------------------------------------------- get /authors -------------------------------------------------

const getAuthor = async function (req, res) {
  try {
    let alldata = await authorModel.find();
    return res
    .status(200)
    .send({ status: true, data: alldata });
  } catch (error) {
    return res
    .status(500)
    .send({ status: false, Error: error.message });
  }
};
//-----------------------------------------------POST /login------------------------------------------------

const authorLogin = async function (req, res) {
  try {
    let data = req.body;

    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "please enter email and password" });
    }
    const { error, value } = validLogin.validate(data);
    if (error) {
      return res
      .status(400)
      .send({ error: error.details[0].message });
    }
    const author= await authorModel.findOne({ email: value.email });
    if (!author) {
      return res
      .status(404)
      .send({ status: false, message: "user not exist" });
    }
    //=============================== token generation =====================================================
    
    let isValidPass = await bcrypt.compare(value.password, author.password)
        if (!isValidPass) {
            return res
            .status(404)
            .send({ status: false, message: "enter correct password..." })
        }
    
    let payload = {
      userId: author._id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000 + 60 * 60 * 24),
    };
    let token = jwt.sign(payload, process.env.Jwt_secret);
    return res
      .status(201)
      .send({ status: true, data: { userId: author._id, token: token } });
  } catch (error) {
    return res
    .status(500)
    .send({ staus: false, msg: error.message });
  }
};

module.exports = { createAuthors, getAuthor, authorLogin };
