const isAdminUser = (req,res,next)=>{
if(req.userInfo.role !== 'admin'){
    return res.status(403).json({
        success: false,
        message: 'Acess denied! admin rights reqquired'
    })
}
next();
}

module.exports = isAdminUser