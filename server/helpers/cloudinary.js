const cloudinary= require('cloudinary').v2;
const multer= require('multer');

cloudinary.config({
    cloud_name:'dyuluxyfm',
    api_key:'636666687165885',
    api_secret:'UUFTg1m9m4XlczlmqnqRb53yJrY',
});

const storage= new multer.memoryStorage();

async function imageUploadUtils(file){
    const result= await cloudinary.uploader.upload(file,{
        resource_type:'auto'
    });
    return result;
}

const upload= multer({storage});
module.exports={upload,imageUploadUtils}