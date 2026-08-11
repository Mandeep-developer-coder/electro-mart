"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { checkAuth } from "../../redux/authSlice";
import { AppDispatch } from "@/app/redux/store";

export default function Signup() {
    const dispatch=useDispatch<AppDispatch>()
    const router=useRouter()
     const [eyePassword, setEyePassword] = useState(false);
const [eyeConfirm, setEyeConfirm] = useState(false);

  const initialState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-pink-200 px-4">
      <div className="bg-yellow-50 w-full max-w-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Signup</h1>

        <Formik
          initialValues={initialState}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            
            const { confirmPassword, ...payload } = values;
            const adminPayload = { ...payload, role: "admin" };
            try {
              const res = await fetch("http://localhost:3005/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adminPayload),
                credentials:"include"
              });

              if (!res.ok) {
                throw new Error(`Server responded with status ${res.status}`);
              }

              const data = await res.json();

                if (data.success) {toast.success(data.msg); 
                  await dispatch(checkAuth())
                  router.push("/admin/dashboard")
                  
                  return
                } else {
                toast.error(data.msg);
              }
            } catch (err) {
              console.error(err);
              toast.error("Internal Server Error");
            }
          }}
        >
          <Form className="flex flex-col gap-4">
            <div className="flex flex-col">
              <Field
                name="name"
                type="text"
                placeholder="Enter name"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-600 text-sm mt-1"
              />
            </div>

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

            <div className="flex flex-col">
              <Field
                name="password"
                type={eyePassword?"text":"password"}
                placeholder="Enter password"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button onClick={()=>setEyePassword(!eyePassword)} className="absolute ml-90 mt-2  text-gray-500 hover:text-gray-700">  <i className={`fa-solid ${eyePassword ? "fa-eye" : "fa-eye-slash"}`}></i></button>
              <ErrorMessage
                name="password"
                component="p"
                className="text-red-600 text-sm mt-1"
              />
            </div>

             <div className="flex flex-col">
              <Field
                name="confirmPassword"
                type={eyeConfirm?"text":"password"}
                placeholder="Enter confirm-password"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button onClick={()=>setEyeConfirm(!eyeConfirm)} className="absolute ml-90 mt-2  text-gray-500 hover:text-gray-700">  <i className={`fa-solid ${eyeConfirm ? "fa-eye" : "fa-eye-slash"}`}></i></button>
              <ErrorMessage
                name="confirmPassword"
                component="p"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <Button
              type="submit"
              className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Signup
            </Button>
          </Form>
        </Formik>

        <div className="flex gap-2 mt-4 justify-center">
          <p>Already have an account?</p>
          <Link href="/login">
            <p className="text-blue-500">Login here</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
