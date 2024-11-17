import reducer from "@/store/auth-slice";
import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      "http://localhost:5000/api/admin/products/add-product",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data
  }
);

export const fetchAllProducts = createAsyncThunk(
    "/product/all",
    async () => {
      const result = await axios.get(
        "http://localhost:5000/api/admin/products/all-products"
      );
      return result?.data
    }
  );

  export const editProduct = createAsyncThunk(
    "/products/editproduct",
    async ({id,formData}) => {
      console.log("id coming is ",id);
      const result = await axios.put(
        `http://localhost:5000/api/admin/products/edit-product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result?.data
    }
  );

  export const deleteProduct = createAsyncThunk(
    "/products/deleteproduct",
    async (id) => {
      const result = await axios.delete(
        `http://localhost:5000/api/admin/products/delete-product/${id}`,
    
      );
      return result?.data
    }
  );


const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.pending, (state)=>{
      state.isLoading= true
    }).addCase(fetchAllProducts.fulfilled,(state,action)=>{
      console.log(`Fetch all products payload : ${action.payload}`)
      state.isLoading = false
      state.productList= action.payload.data;
    }).addCase(fetchAllProducts.rejected,(state,action)=>{
      console.log(`Fetch all products payload : ${action.payload}`)
      state.isLoading = true
      state.productList= []
    })
  },
});

export default adminProductsSlice.reducer
