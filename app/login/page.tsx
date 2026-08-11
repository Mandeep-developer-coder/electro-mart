"use client";
import Link from "next/link";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { login } from "../redux/authSlice";
import { useDispatch ,useSelector} from "react-redux";

import { getCart } from "../redux/cart/cartSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { checkAuth } from "../redux/authSlice";


export default function Login() {
    const dispatch=useDispatch<AppDispatch>()
    // const {role}=useSelector((state:RootState)=>state.auth)
  const [eye, setEye] = useState(false);
  const router=useRouter()
  const initialState = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      .required("This field is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("This field is required"),
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-pink-200 px-4">
      <div className="bg-yellow-50 w-full max-w-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <Formik
          initialValues={initialState}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const res = await fetch("http://localhost:3005/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
                credentials:"include"
              });

              if (!res.ok) {
                throw new Error(`Server responded with status ${res.status}`);
              }

              const data = await res.json();
              if (data.success) {
                
                toast.success(data.msg); 
                console.log(data.role)
                 if(data.role=="admin"){
                  router.replace("/admin/dashboard")
                }
                else{
                          router.replace("/products")
                }
               
              
                // dispatch(login({email:data.email}))
           await dispatch(checkAuth())
                dispatch(getCart())
                
                
                return
              }
              else {toast.error(data.msg)
                // router.push("/signup")
              };

              console.log(values);
            } catch (err) {
              toast.error("Internal Server Error");
            }
          }}
        >
          <Form className="flex flex-col gap-4">
         
            <div className="flex flex-col">
              <Field
                name="email"
                type="email"
                placeholder="Enter email"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div className="flex flex-col relative">
              <Field
                name="password"
                type={eye ? "text" : "password"}
                placeholder="Enter password"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setEye(!eye)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                <i className={`fa-solid ${eye ? "fa-eye" : "fa-eye-slash"}`}></i>
              </button>
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-600 text-sm mt-1"
              />
            </div>

          
            <Button
              type="submit"
              className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </Button>
          </Form>
        </Formik>

        
        <div className="flex justify-between mt-4 text-sm">
          <p>
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
          <Link href="/forgot-password" className="text-blue-500 font-medium">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
