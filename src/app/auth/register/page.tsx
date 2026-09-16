"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { PiSpinnerBold } from "react-icons/pi";
import { useRegister } from "@/Hooks/api/auth_api";
import Container from "@/Components/Common/Container";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

type TabType = "Buyer" | "Seller";

type LoginFormData = {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  confirmPassword: string;
  role: "buyer" | "seller";
  termsAndConditions: boolean;
};

const Login = () => {
  const { mutate, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("Buyer");
  const [confirmshowPassword, confirmsetShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>();

  const password = watch("password");

  const onSubmit = (data: LoginFormData) => {
    mutate({
      ...data,
      role: activeTab === "Buyer" ? "buyer" : "seller",
    });
  };

  return (
    <Container>
      <div className="flex min-h-screen items-center justify-center gap-10 py-8 lg:py-10">
        <div className="hidden lg:flex xl:w-[65%] lg:w-[50%] items-center justify-center h-full">
          <img
            src="https://i.ibb.co.com/7dPT0LX2/30ad3fc61803922fec84f5a2798ab18904d9635f.jpg"
            alt="Login Visual"
            className="rounded-2xl w-full h-full object-cover"
          />
        </div>

        <div className="w-full xl:w-[35%] lg:w-[50%] flex items-center justify-center lg:px-6 px-3">
          <div className="w-full ">
            <h1 className="Auth_section_title mb-2 xl:text-[36px] text-[28px] lg:text-start text-center">
              Create account
            </h1>

            <div className="bg-[#E6F3FF] py-2.5 px-2 mt-10 rounded-3xl lg:rounded-[40px] flex gap-x-2 lg:gap-x-3 mb-6 lg:mb-7">
              <button
                type="button"
                onClick={() => setActiveTab("Buyer")}
                className={`rounded-3xl lg:rounded-[40px] py-2.5 px-6 lg:py-1 lg:px-0 w-full text-center font-medium transition-all duration-200 cursor-pointer lg:text-[20px] text-base
                  ${
                    activeTab === "Buyer"
                      ? "bg-[#0085FF] text-white shadow-md"
                      : "bg-transparent text-[#212B36] hover:bg-blue-50"
                  }`}
              >
                Buyer
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("Seller")}
                className={`rounded-3xl lg:rounded-[40px] py-2.5 px-6 lg:py-1 lg:px-0 w-full text-center font-medium transition-all duration-200 cursor-pointer lg:text-[20px] text-base
                  ${
                    activeTab === "Seller"
                      ? "bg-[#0085FF] text-white shadow-md"
                      : "bg-transparent text-[#212B36] hover:bg-blue-50"
                  }`}
              >
                Seller
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-lg text-[#5F5F5F] mb-2 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-blue"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg text-[#5F5F5F] mb-2 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-blue"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg text-[#5F5F5F] mb-2 font-medium">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-blue"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg text-[#5F5F5F] mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-blue"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+])[A-Za-z\d@$!%*?&#+]{8,32}$/,
                        message:
                          "Password must be 8–32 characters with uppercase, lowercase, number & special character",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg text-[#5F5F5F] mb-2 font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={confirmshowPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-blue"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: value =>
                        value === password || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => confirmsetShowPassword(!confirmshowPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {confirmshowPassword ? (
                      <IoEyeOffOutline />
                    ) : (
                      <IoEyeOutline />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-primary-blue"
                  {...register("termsAndConditions", {
                    required: "You must accept the terms",
                  })}
                />
                Remember Me
              </label>
              {errors.termsAndConditions && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.termsAndConditions.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary-blue text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-60 cursor-pointer"
              >
                {isPending ? (
                  <PiSpinnerBold className="animate-spin size-[20px] fill-white mx-auto" />
                ) : (
                  "Next"
                )}
              </button>
            </form>

            <p className="text-center text-gray-500 mt-5">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-primary-blue font-medium hover:underline"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
