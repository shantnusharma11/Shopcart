const { imageUploadUtils } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtils(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.status.json({
      success: false,
      message: "Error Occured",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const newlyCreatedProduct= new Product({
        image,
        title,
        description,
        category,
        brand,
        price,
        salePrice,
        totalStock,
    })
    await newlyCreatedProduct.save();
    res.status(201).json({
        success:true,
        data: newlyCreatedProduct,
        message:'Product added successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts= await Product.find({});
    res.status(200).json({
        success:true,
        data:listOfProducts
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const {id}= req.params;
    const {
        image,
        title,
        description,
        category,
        brand,
        price,
        salePrice,
        totalStock,
      } = req.body;
      const findProduct= await Product.findById(id);
      if(!findProduct){
        return res.status(404).json({
            success:false,
            message:"Product not found",
        })
      }
      findProduct.title= title || findProduct.title
      findProduct.description= description || findProduct.description
      findProduct.category= category || category.title
      findProduct.brand= brand || findProduct.brand
      findProduct.price= price || findProduct.price
      findProduct.salePrice= salePrice || findProduct.salePrice
      findProduct.totalStock= totalStock || findProduct.totalStock
      findProduct.image= image || findProduct.image

      await findProduct.save();
      return res.status(200).json({
        success:true,
        data:findProduct,
        message:"Prodcy edit successfully"
      })



  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const{id}= req.params;
    const product= await Product.findByIdAndDelete(id)
    if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found",
            })
    }
    return res.status(200).json({
        message:"Product deleted successfully",
        success:true,
        data: product,
    })

 } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
