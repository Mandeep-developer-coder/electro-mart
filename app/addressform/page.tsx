"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

const addressSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Min 2 characters")
    .matches(/^[a-zA-Z\s]+$/, "Only letters allowed"),

  phone: Yup.string()
    .required("Phone is required")
    .matches(/^[6-9]\d{9}$/, "Enter valid 10 digit number"),

 

  street: Yup.string()
    .required("Address is required")
    .min(5, "Address too short"),

  city: Yup.string()
    .required("City is required")
    .matches(/^[a-zA-Z\s]+$/, "Only letters allowed"),

  state: Yup.string()
    .required("State is required")
    .matches(/^[a-zA-Z\s]+$/, "Only letters allowed"),

  zip: Yup.string()
    .required("Pincode is required")
    .matches(/^[1-9][0-9]{5}$/, "Invalid pincode"),

  country: Yup.string().required("Country is required"),
});



export default function AddressForm() {
    const router=useRouter()
    const handleSubmit = async(values: any) => {
  const payload = {
    ...values,
    phone: `+91${values.phone}`,
  };
  try{
    const res=await fetch("http://localhost:3005/user/add-address",{
        method:"Post",
        headers:{'Content-Type':"application/json"},
        credentials:"include",
        body:JSON.stringify(payload)
    })
    const data=await res.json()
    if(data.success){
        toast.success("Saved")
        router.push("/checkout")
    }

  }catch(error:any){
    if(error.response){
        console.log(error.response.message)

    }

  }
  
//   console.log(payload);
};
  const initialValues = {
    name: "",
    phone: "",
  
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={addressSchema}
      onSubmit={handleSubmit}
    >
      <Form className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-5">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Add New Address
        </h2>

      
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Full Name
          </label>
          <Field
            name="name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <ErrorMessage name="name" component="p" className="text-red-500 text-xs" />
        </div>

        
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Phone Number
          </label>
          <Field
            name="phone"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <ErrorMessage name="phone" component="p" className="text-red-500 text-xs" />
        </div>

       
       

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Street Address
          </label>
          <Field
            name="street"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <ErrorMessage name="street" component="p" className="text-red-500 text-xs" />
        </div>

   
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              City
            </label>
            <Field
              name="city"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <ErrorMessage name="city" component="p" className="text-red-500 text-xs" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              State
            </label>
            <Field
              name="state"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <ErrorMessage name="state" component="p" className="text-red-500 text-xs" />
          </div>
        </div>

        
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Pincode
          </label>
          <Field
            name="zip"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <ErrorMessage name="zip" component="p" className="text-red-500 text-xs" />
        </div>

        
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Country
          </label>
          <Field
            name="country"
            readOnly
            className="w-full  text-gray-400 px-4 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          Save Address
        </button>

      </Form>
    </Formik>
  );
}
