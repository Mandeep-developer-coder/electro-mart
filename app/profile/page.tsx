"use client";

import Image from "next/image";
import { useState ,useEffect} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";

import { toast } from "react-toastify";

interface UserType {
  name: string;
  phone: string;
  email: string;
  avatar?: string;
}
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter valid 10 digit mobile number")
    .required("Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  avatar: Yup.mixed().required("Profile image is required"),
});

export default function ProfilePage() {
    const [user,setUser]=useState<UserType|null>(null)
    useEffect(()=>{
        const fetchProfile=async()=>{
            const res=await fetch("http://localhost:3005/profile/get-profile",{
                method:"Get",
                headers:{'Content-Type':"application.json"},
                credentials:"include"
            })
            const data=await res.json()
            setUser(data)
            if (data.avatar) {
      setPreview(data.avatar);
    } else {
      setPreview("https://cdn-icons-png.flaticon.com/512/149/149071.png"); 
    }

        }
    fetchProfile()
    },[])
   
//   const user = {
//     name: "Mandeep Kaur",
//     phone: "9123456789",
//     email: "user@email.com",
//     imageUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
//   };


  const [preview, setPreview] = useState(user?.avatar||"https://cdn-icons-png.flaticon.com/512/149/149071.png");

 
  const initialValues: UserType = {
    name: user?.name||"",
    phone: user?.phone?user.phone.startsWith('+91')?user.phone.slice(3):user.phone:"",
    email: user?.email||"",
    avatar: user?.avatar||"", 
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8">

      <Formik
       enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async(values) => {
            const payload={...values,phone:'+91'+values.phone}
        
          const formData = new FormData();
          formData.append("name", payload.name);
          formData.append("phone", payload.phone);
          formData.append("email", payload.email);
          if (values.avatar) formData.append("avatar", values.avatar);
          const res=await fetch("http://localhost:3005/profile/update-profile",{
            method:"Put",
           
            credentials:"include",
            body:formData

          })
          const data=await res.json()
          if (data.success){
            toast.success("Saved")

          }

        //   console.log("Form ready for API", values, formData);
        }}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-8">

     
            <div className="flex flex-col items-center gap-4">
              <img
                src={preview}
                alt="Profile"
                width={110}
                height={110}
                className="rounded-full border object-cover"
              />

     
              <Field name="avatar">
                {() => (
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      if (file) {
                        setFieldValue("avatar", file); // Formik update
                        setPreview(URL.createObjectURL(file)); // UI preview
                      }
                    }}
                  />
                )}
              </Field>

              <p className="text-red-500 text-sm">
                <ErrorMessage name="avatar" />
              </p>
            </div>

            <hr />

    
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <Field
                name="name"
                className="w-full border p-2 rounded mt-1"
              />
              <p className="text-red-500 text-sm">
                <ErrorMessage name="name" />
              </p>
            </div>

           
            <div>
              <label className="text-sm text-gray-500">Mobile Number</label>
              <Field
                name="phone"
                className="w-full border p-2 rounded mt-1"
              />
              <p className="text-red-500 text-sm">
                <ErrorMessage name="phone" />
              </p>
            </div>

     
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <Field
                name="email"
                type="email"
                className="w-full border p-2 rounded mt-1"
              />
              <p className="text-red-500 text-sm">
                <ErrorMessage name="email" />
              </p>
            </div>

            <Button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600"
            >
              Save Changes
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
