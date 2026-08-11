"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function ForgotPassword() {
  const router = useRouter();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-pink-200 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const res = await fetch(
                "http://localhost:3005/auth/forgot-password",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                  credentials:"include"
                }
              );

              const data = await res.json();

              if (data.success) {
                toast.success("OTP sent to your email");
                router.push(`/otp?email=${encodeURIComponent(values.email)}`);
              
              } else {
                toast.error(data.msg || "Something went wrong");
              }
            } catch (err) {
              toast.error("Server error");
            }
          }}
        >
          <Form className="flex flex-col gap-4">
            <div>
              <Field
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <Button
              type="submit"
              className="bg-linear-to-r from-pink-500 to-purple-700 text-white"
            >
              Send OTP
            </Button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
