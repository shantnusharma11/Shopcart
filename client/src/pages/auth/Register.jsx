import CommonForm from "@/components/common/form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

const initialState={
  userName: '',
  email: '',
  password: '',
}
const Register = () => {
  const navigate= useNavigate();
  const [formData, setFormData]= useState(initialState);
  const {toast}= useToast();

  const dispatch= useDispatch();

  function onSubmit(event){
    event.preventDefault();
    dispatch(registerUser(formData)).then((data)=>{
      if (data?.payload?.success== true) {
        console.log("Coming inside data condition");
        toast({
          title: data?.payload?.message, 
          
        })
        navigate('/auth/login');
      }else{
        toast({
          title: data?.payload?.message, 
          variant:  'destructive',
        });
      }
      console.log(data);
    });
  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default Register;
  