"use client";

import { Suspense, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

function OtpFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [eye1, setEye1] = useState(false);
  const [eye2, setEye2] = useState(false);

  const initialEmail = searchParams.get("email") || "";

  const initialValues = {
    email: initialEmail,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    otp: Yup.string()
      .length(6, "OTP must be exactly 6 digits")
      .matches(/^\d+$/, "OTP must be numeric")
      .required("OTP is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your password"),
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-pink-200 px-4 py-8">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const res = await fetch("http://localhost:3005/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: values.email,
                  otp: values.otp,
                  newPassword: values.newPassword,
                }),
                credentials: "include",
              });

              const data = await res.json();

              if (data.success) {
                toast.success(data.msg || "Password reset successfully");
                router.push("/login");
              } else {
                toast.error(data.msg || "Invalid OTP or details");
              }
            } catch (err) {
              toast.error("Server error");
            }
          }}
        >
          <Form className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <Field
                name="email"
                type="email"
                placeholder="Enter email"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">6-Digit OTP</label>
              <Field
                name="otp"
                type="text"
                maxLength={6}
                placeholder="Enter OTP"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <ErrorMessage name="otp" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <Field
                  name="newPassword"
                  type={eye1 ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setEye1(!eye1)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className={`fa-solid ${eye1 ? "fa-eye" : "fa-eye-slash"}`}></i>
                </button>
              </div>
              <ErrorMessage name="newPassword" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <Field
                  name="confirmPassword"
                  type={eye2 ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setEye2(!eye2)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i className={`fa-solid ${eye2 ? "fa-eye" : "fa-eye-slash"}`}></i>
                </button>
              </div>
              <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <Button
              type="submit"
              className="mt-4 bg-linear-to-r from-pink-500 to-purple-700 text-white cursor-pointer"
            >
              Reset Password
            </Button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center bg-pink-200">Loading...</div>}>
      <OtpFormContent />
    </Suspense>
  );
}
