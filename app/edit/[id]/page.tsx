"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams } from "next/navigation";
import { useEffect} from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { getAddressById } from "@/app/redux/address/addressSlice";
import { RootState,AppDispatch } from "@/app/redux/store";
import { useDispatch,useSelector } from "react-redux";
export default function Edit() {
    const router=useRouter()
    const params=useParams()
    const id=params.id as string
    const dispatch=useDispatch<AppDispatch>()
    const {selectedAddress}=useSelector((state:RootState)=>state.address)
    // const oldAddress=address.find((adr)=>adr._id==id)
    useEffect(()=>{
        if(id){
            dispatch(getAddressById(id ))
        }
         
    },[id,dispatch])
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

  const initialValues = {
    name: selectedAddress?.name||"",
    phone: selectedAddress?.phone?selectedAddress.phone.startsWith('+91')?selectedAddress?.phone.slice(3):"":"",
    street: selectedAddress?.street||"",
    city: selectedAddress?.city||"",
    state:selectedAddress?.state|| "",
    zip:selectedAddress?.zip|| "",
    country: "India",
  };

  const handleSubmit = async(values:any) => {
    const payload={...values,phone:`+91${values.phone}`}
    const res=await fetch(`http://localhost:3005/user/getAddressByIdAndUpdate/${id}`,{
        method:"Put",
        headers:{'Content-Type':"application/json"},
        credentials:"include",
        body:JSON.stringify(payload)
    })
    const data=await res.json()
    if(data.success){
        toast.success("Changed Successfuly")
        router.push("/savedaddress")


    }

  };

  return (
    <Formik
    enableReinitialize
      initialValues={initialValues}
      validationSchema={addressSchema}
      onSubmit={handleSubmit}
    >
      <Form className="max-w-xl mx-auto rounded-2xl p-8 space-y-5 shadow-lg bg-white">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Edit Address
        </h2>


        <div>
          <label className="text-sm font-medium text-gray-600">Full Name</label>
          <Field
            name="name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
          />
          <ErrorMessage name="name" component="p" className="text-red-500 text-xs" />
        </div>

     
        <div>
          <label className="text-sm font-medium text-gray-600">Phone</label>
          <Field
            name="phone"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
          />
          <ErrorMessage name="phone" component="p" className="text-red-500 text-xs" />
        </div>

      
        <div>
          <label className="text-sm font-medium text-gray-600">Street Address</label>
          <Field
            name="street"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
          />
          <ErrorMessage name="street" component="p" className="text-red-500 text-xs" />
        </div>

     
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">City</label>
            <Field
              name="city"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />
            <ErrorMessage name="city" component="p" className="text-red-500 text-xs" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">State</label>
            <Field
              name="state"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />
            <ErrorMessage name="state" component="p" className="text-red-500 text-xs" />
          </div>
        </div>

   
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Pincode</label>
            <Field
              name="zip"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />
            <ErrorMessage name="zip" component="p" className="text-red-500 text-xs" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Country</label>
            <Field
              name="country"
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>
        </div>

     
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-black text-white font-medium hover:opacity-90 transition"
        >
          Save Address
        </button>
      </Form>
    </Formik>
  );
}
