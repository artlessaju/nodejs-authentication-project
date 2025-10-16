const User = require('../models/User')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

//register controller

const registerUser = async(req,res)=>{
try{

    //extract user information from request body

const {username,email,password,role} = req.body;

//check if user is already exists in db

const checkExistingUser = await User.findOne({$or:[{username},{email}]})

if(checkExistingUser){
    return res.status(400).json({
        success:false,
        message:'User alreday exists either with same email or username..please try with a different one '
    })
}

///hash user password

const salt = await bcrypt.genSalt(10)

const hashedPassword = await bcrypt.hash(password,salt)

//create a new user and save in database


const newlyCreatedUser = new User({
    username,email,password:hashedPassword,role:role || 'user'
})

await newlyCreatedUser.save()

if(newlyCreatedUser){
    res.status(201).json({
        success:true,
        message:'User registered successfully'
    })
}

else{
   
    res.status(400).json({
        success:false,
        message:'unable to register user please try again'
    })


}

}
catch(e){
console.log(e)
res.status(500).json({
success:false,
message:'Something went wrong..please try again'
})
}

}


//login controller

const loginUser = async(req,res)=>{
    try{

const {username,password} = req.body;

//check if the current user is exists in database or not

const user = await User.findOne({username})

if(!user){
    return res.status(400).json({
        success:false,
        message:'user dosent exist'
    })
}

///if the password is correct or not

const isPasswordMatch = await bcrypt.compare(password,user.password)

if(!isPasswordMatch){
    return res.status(400).json({
        success:false,
        message:'Invalid credentials'
    })
}

//create user token

const accessToken = jwt.sign({
    userId : user._id,
    username : user.username,
    role : user.role
},process.env.JWT_SECRET_KEY,{
    expiresIn: '30m'
})

res.status(200).json({
    success: true,
    message: 'Logged in successfull',
    accessToken
})


}
catch(e){
console.log(e)
res.status(500).json({
success:false,
message:'Something went wrong..please try again'
})
}
}
 
//change password

const changePassword = async(req,res)=>{

try{

const userId = req.userInfo.userId;

//extract old and new password

const {oldPassword,newPassword} = req.body;

//find the current looged in user

const user = await User.findById(userId);

if(!user){
    return res.status(400).json({
        success:false,
        message:'User not found'
    })
}

//if the old password is correct

const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);


if(!isPasswordMatch){
    return res.status(400).json({
        success:false,
        message:'OLD PASSWORD IS NOT CORRECT ,PLease try again'
    })
}

//hash the new password here

const salt = await bcrypt.genSalt(10);
const newHashedPassword = await bcrypt.hash(newPassword,salt)

//update user password

user.password = newHashedPassword

await user.save();

res.status(200).json({
    success:true,
    message:'passoword changed successfully'
})


}
catch(e){
console.log(e)
res.status(500).json({
success:false,
message:'Something went wrong..please try again'
})
}
}



module.exports = {registerUser,loginUser,changePassword}