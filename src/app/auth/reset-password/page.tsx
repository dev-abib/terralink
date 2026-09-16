"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PiSpinnerBold } from "react-icons/pi";
import Container from "@/Components/Common/Container";
import { UseResetPassword } from "@/Hooks/api/auth_api";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

type LoginFormData = {
  password: string;
  confirmPassword: string;
};

const page = () => {
  const { mutate, isPending } = UseResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmshowPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    mutate({
      ...data,
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

        {/* Right Form Section */}
        <div className="w-full xl:w-[35%] lg:w-[50%] flex items-center justify-center px-6">
          <div className="w-full ">
            <h1 className="Auth_section_title mb-2 xl:text-[36px] md:text-[28px] text-[24px] lg:text-start text-center">
              Set Your New Password
            </h1>
            <p className="text-[#404040] mb-8 lg:text-lg text-base lg:text-start text-center ">
              Let’s get you back on track! Create a strong and unique password
              to keep your Terralink account protected.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-lg text-[#5F5F5F] mb-2 font-medium">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-blue"
                    {...register("password", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters required",
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

              {/* Confirm Password */}
              <div>
                <label className="block text-lg text-[#5F5F5F] mb-2 font-medium">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={confirmshowPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-blue"
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: value =>
                        value === watch("confirmPassword") ||
                        "Passwords do not match",
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!confirmshowPassword)}
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

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-primary-blue text-white py-3 rounded-lg hover:bg-blue-600 transition cursor-pointer"
              >
                {isPending ? (
                  <PiSpinnerBold className="animate-spin size-[20px] fill-white mx-auto" />
                ) : (
                  "Save Password"
                )}
              </button>
            </form>

            <Link href={"/auth/login"}>
              <button className="flex gap-x-2 items-center text-[20px] font-medium text-center text-[#0085FF] mx-auto cursor-pointer mt-8">
                <MdOutlineArrowBackIosNew />
                Back to log in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default page;
