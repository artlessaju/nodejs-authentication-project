const Image = require('../models/Image')

const {uploadToCloudinary} = require('../helpers/cloudinaryHelper')

const fs = require('fs')

const cloudinary = require('../config/cloudinary.js')


const uploadImageController = async(req,res)=>{

try{

//if file is missing on request object

if(!req.file){
 
    return res.status(400).json({
        success:false,
        message:'file is required. please upload a image'
    })

}

//upload to cloudinary

const {url,publicId} = await uploadToCloudinary(req.file.path)


//store image url and publicid along with the uploaded user id

const newlyUploadedImage = new Image({
    url,
    publicId,
    uploadedBy:req.userInfo.userId
})

await newlyUploadedImage.save();

//delete the file from  local storage

// fs.unlinkSync(req.file.path);


res.status(201).json({
    success:true,
    message:'Image uploaded successfully',
    image: newlyUploadedImage,
})

}
catch(error){
    console.log(error);
    res.status(500).json({
        success:false,
        message:'Something went wrong please try again'
    })
}

}

const fetchImagesController = async(req,res)=>{

try{

const page = parseInt(req.query.page) || 1;

const limit = parseInt(req.query.limit) || 2;

const skip = (page -1) * limit;

const sortBy = req.query.sortBy || 'createdAt';

const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

const totalImages = await Image.countDocuments();

const totalPages = Math.ceil(totalImages / limit)

const sortObj = {};

sortObj[sortBy] = sortOrder

const images = await Image.find().sort(sortObj).skip(skip).limit(limit)

if(images){
    res.status(200).json({
        success:true,
        currentPage:page,
        totalPages:totalPages,
        totalImages:totalImages,
        data:images,
    })
}


}
catch(e){
    console.log(error);
    res.status(500).json({
        success:false,
        message:'Something went wrong please try again'
    })
}

}

const deleteImageController = async(req,res)=>{
    try{

const getCurrentIdOfImageToBeDeleted = req.params.id;

const userId = req.userInfo.userId

const image = await Image.findById(getCurrentIdOfImageToBeDeleted)

if(!image){
    return res.status(404).json({
        success:false,
        message:'Image not found'
    })
}

//check if this image is uploaded by the current user who is trying to delete this image

if(image.uploadedBy.toString() !== userId){
return res.status(403).json({
    success:false,
    messagee:'you are not authorised to delete this image because you havent uploaded it'
})
}

//delete this image first from your cloudinary storage

await cloudinary.uploader.destroy(image.publicId)


//delete this image from mongodb

await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);


res.status(200).json({
    success:true,
    message:'Image deleted succesfully'
})

    }
    catch(e){
 res.status(500).json({
        success:false,
        message:'Something went wrong please try again'
    })
    }
}


module.exports = {uploadImageController,fetchImagesController,deleteImageController}