const authorModel = require('../models/authormodel')
const jwt = require('jsonwebtoken')


//-------------------------------------------------- APIs /authors --------------------------------

const createAuthors =  async function (req, res) {
    try {
        //=========================================== user not entered any data ==========================================
        let authorData = req.body
        if (Object.keys(authorData).length == 0) {
            return res.status(400).send({ status: false, message: "please enter data" })
        }

        //====================================Validating fname ================================================
        if (!authorData.fname) {
            return res.status(400).send({ status: false, message: "fname is required" })
        }
        //================================ VALIDATING lname ===============================================
        if (!authorData.lname) {
            return res.status(400).send({ status: false, message: "lname is required" })
        }
        //=======================================title validation =============================================
        if (!authorData.title) {
            return res.status(400).send({ status: false, message: "title is required" })
        }
        if (["Mr", "Mrs", "Miss"].indexOf(authorData.title) == -1) {
            return res.status(400).send({ status: false, message: "please enter Mr , Mrs, Miss" })
        }
        //=========================================email validation =============================================
        if (!authorData.email) {
            return res.status(400).send({ status: false, message: "email is required." })
        }
        let emailAlreadyExist = await authorModel.findOne({ email: authorData.email })
        if (emailAlreadyExist) {
            return res.status(400).send({ status: false, message: "Email already exist." })
        }

        //====================================== password validation =======================================       
        if (!authorData.password) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

        //========================================= author created ========================================
        let createdAuthor = await authorModel.create(authorData)
        return res.status(201).send({ status: true, message: "Author created sucessfully", data: createdAuthor })

    }
    catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}


//--------------------------------------------- get /authors -------------------------------------------------

const getAuthor = async function (req, res) {
    try{
        let alldata = await authorModel.find()
        return res.status(200).send({ status: true, data: alldata })
    }
    catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}
//-----------------------------------------------POST /login------------------------------------------------

const authorLogin = async function (req, res) {
    try {
        let userName = req.body.email;
        let password = req.body.password;

        let user = await authorModel.findOne({ email: userName, password: password }); 
        //======================== if body is empty =============================================
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "Data is required" })
        }
        //============================= if username is not entered ====================================
        if (!userName) {
            return res.status(400).send({ status: false, msg: "UserName is required" })
        }
        //================================= if password id not entered ================================
        if (!password) {
            return res.status(400).send({ status: false, msg: "Password is required" })
        }
        //===================================== if no matching data found =======================================
        if (!user) {
            return res.status(401).send({ status: false, msg: "UserName or Password incorrect" });
        }
        //=============================== token generation =====================================================
        let payload = { _id: user._id, 
             iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000 + 60 * 60 * 24)
    }
        let token = jwt.sign(payload, process.env.Jwt_secret);
        return res.status(201).send({ status: true, data:{ token: token,userId : user._id}});
    }
    catch (error) {
        return res.status(500).send({ staus: false, msg: error.message })
    }
};

module.exports = { createAuthors, getAuthor, authorLogin }
