const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-Middleware')
const uploadMiddleware = require('../middleware/upload-middleware')
const {uploadImageController,fetchImagesController,deleteImageController} = require('../controllers/image-controller')



const router = express.Router()

//upload the image
router.post('/upload',authMiddleware,adminMiddleware,uploadMiddleware.single('image'),uploadImageController)


//to get all the image

router.get('/get',authMiddleware,fetchImagesController);


//delete Image route
// 68ea22bed80f342518159a65
router.delete('/:id',authMiddleware,adminMiddleware,deleteImageController)

module.exports = router