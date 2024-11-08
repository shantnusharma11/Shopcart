const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

//register
const registerUser = async (req, res) => {
    console.log(req.body);
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User already exists with same email, please try again",
      });
    const hashPasssword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPasssword,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "registration successfull",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Some error occured while register",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.json({
        success: false,
        message: "User not exists! Please Register first ",
      });
    }
    const checkPassowrdMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPassowrdMatch) {
      return res.json({
        success: false,
        message: "Incorrect password, try again!",
      });
    }
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );
    res.cookie('token',token, {httpsOnly: true, secure:false}).json({
        success:true,
        message:"Logged In successfully",
        user:{
            email:checkUser.email,
            role: checkUser.role,
            id: checkUser._id
        }
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error occured while logging in",
    });
  }
};

//logout
const logout= (req,res)=>{
    res.clearCookie('token').json({
        success:true,
        message:'logged out successfully'
    });
};

//auth middleware
const authMiddleware= async(req,res,next)=>{
    const token= req.cookies.token;
    if(!token){
        return res.status(401).json({
            success:false,
            message:'Unauthorised user!'
        })
    }
        try{
            const decode= jwt.verify(token,'CLIENT_SECRET_KEY');
            req.user= decode;
            next();
        }catch(error){
            res.status(401).json({
                success:false,
            message:'Unauthorised user!'
            })
        }
}

module.exports = { registerUser ,loginUser,logout,authMiddleware};
