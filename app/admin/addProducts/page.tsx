"use client";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { toast } from "react-toastify";
export default function AddProduct() {
  const validationSchema = Yup.object({
  title: Yup.string()
   
    .required("Title is required"),

  brand: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
    .required("Brand is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),

  stock: Yup.number()
    .typeError("Stock must be a number")
    .integer("Stock must be whole number")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),

  category: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
    .required("Category is required"),

  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),

  images: Yup.array()
    .min(1, "Atleast 1 image is required")
    .required("Image is required"),
});

  const initialValues = {
    title: "",
    brand: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    images: [],
  };
  const handleSubmit = async (values:any,{resetForm}:{resetForm:any}) => {
   const formdata = new FormData();
formdata.append("title", values.title)
formdata.append("brand", values.brand)
formdata.append("price", values.price)
formdata.append("stock", values.stock)
formdata.append("description", values.description)
formdata.append("category", values.category)


values.images.forEach((file: File) => {
  formdata.append("images", file); 
})

    try{
        const res=await fetch("http://localhost:3005/products/add-products",{
            method:"Post",
            credentials:"include",
            body:formdata
        })
        const data=await res.json()
if(data.success){
    toast.success(data.msg)

}
else{
    toast.error(data.msg)
}
resetForm()
    }
    catch(err){
console.log(err)
    }
    
{

}  };
  return (
    <div className="min-h-screen bg-gray-500 pt-10">
      <div className="max-w-3xl w-full mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className=" font-bold">Add Product</h1>
        <p className="text-gray-500">Enter product details below</p>
        <div className="flex flex-col mt-8">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            
            {({ setFieldValue,values}) => (
              <Form>
                <label>Product Title</label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Enter Product Title"
                  className="border border-gray-400 w-full p-3 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
                ></Field>

                <ErrorMessage
                  name="title"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />

                <label>Price</label>
                <Field
                  type="text"
                  name="price"
                  placeholder="Enter price"
                  className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
                ></Field>
                <ErrorMessage
                  name="price"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
                <div className="flex gap-3">
                  <div className="flex flex-col w-1/2">
                    <label>Brand</label>
                    <Field
                      type="text"
                      name="brand"
                      placeholder="Enter brand"
                      className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
                    ></Field>
                    <ErrorMessage
                      name="brand"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label>Category</label>
                    <Field
                      type="text"
                      name="category"
                      placeholder="Enter category"
                      className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
                    ></Field>
                    <ErrorMessage
                      name="category"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
                <label>Stock</label>
                <Field
                  type="text"
                  name="stock"
                  placeholder="Enter stock"
                  className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
                ></Field>
                <ErrorMessage
                  name="stock"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
                <label>Description</label>
                <Field
                  type="text"
                  name="description"
                  placeholder="Enter category"
                  className="border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
                ></Field>
                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
                <label>Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>{
                    const files=Array.from(e.target.files||[])
                    setFieldValue("images", [...values.images,...files])
                  }}
                  className="border border-gray-300 rounded-lg w-full p-3"
                />
                <ErrorMessage
                  name="images"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
                <Button className="w-full mt-4 bg-pink-900 text-white" type="submit">Submit</Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
