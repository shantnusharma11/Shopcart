import ProductImageUpload from "@/components/admin-view/imageupload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin-slice/products-slice";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};
const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [curentEditedID, setCurrentEditedId] = useState(null);
  const { productList } = useSelector((state) => state.adminProducts);

  const dispath = useDispatch();

  function onSubmit(event) {
    event.preventDefault();
    curentEditedID !== null
      ? dispath(
          editProduct({
            id: curentEditedID,
            formData: formData,
          })
        ).then((data) => {
          console.log("Edited product form data is", data);
          if (data.payload?.success) {
            dispath(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispath(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          console.log("form data is:", data);
          if (data?.payload?.success) {
            dispath(fetchAllProducts());
            setImageFile(null);
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            toast({
              title: "Product Addedd successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId){
    console.log(getCurrentProductId);
    dispath(deleteProduct(getCurrentProductId)).then(data=>{
      if(data.payload.success){
        dispath(fetchAllProducts());
      }
    })
  }

  function isFormValid() {
    return Object.keys(formData).every((key) => {
      const value = formData[key];
      return typeof value === "string" ? value.trim() !== "" : Boolean(value);
    });
  }

  useEffect(() => {
    dispath(fetchAllProducts());
  }, [dispath]);

  console.log(formData, "formData");
  console.log(
    "productsList, Uploaded image Url",
    productList,
    uploadedImageUrl
  );

  return (
    <Fragment>
      <div className="mb-5 flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add new Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {curentEditedID !== null ? "Edit Product" : "Add new Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={curentEditedID !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={curentEditedID !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled ={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default AdminProducts;
