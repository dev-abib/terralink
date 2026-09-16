"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { PiSpinnerBold } from "react-icons/pi";
import Link from "next/link";
import Container from "@/Components/Common/Container";
import { useGoogleLogin, useLogin } from "@/Hooks/api/auth_api";
import { IoEyeOffOutline, IoEyeOutline, IoHomeOutline } from "react-icons/io5";
import { useGoogleLogin as useGoogleAuth } from "@react-oauth/google";
type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"buyer" | "seller" | null>(
    null,
  );

  const { mutate, isPending } = useLogin();
  const { mutate: googleLoginMutate, isPending: isGooglePending } =
    useGoogleLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  // Initialize Google Auth
  const loginWithGoogle = useGoogleAuth({
    onSuccess: (tokenResponse: any) => {
      if (selectedRole) {
        googleLoginMutate({
          access_token: tokenResponse.access_token,
          role: selectedRole,
        });
      }
    },
    onError: (error: any) => console.error("Google Login Failed:", error),
  });

  const onSubmit = (data: LoginFormData) => {
    mutate({ ...data });
  };

  const handleGoogleClick = () => {
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role: "buyer" | "seller") => {
    setSelectedRole(role);
    setShowRoleModal(false);
    loginWithGoogle();
  };

  return (
    <Container>
      <div className="relative flex min-h-screen items-center justify-center gap-10 py-8 lg:py-10">
          {showRoleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
              <h2 className="text-2xl font-bold mb-4">Join as a...</h2>
              <div className="flex gap-4 justify-center mt-6">
                <button
                  onClick={() => handleRoleSelect("buyer")}
                  className="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  Buyer
                </button>
                <button
                  onClick={() => handleRoleSelect("seller")}
                  className="px-6 py-3 border border-primary-blue text-primary-blue rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  Seller
                </button>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="mt-6 text-sm text-gray-400 hover:underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="hidden lg:flex xl:w-[65%] lg:w-[50%] items-center justify-center h-full">
          <img
            src="https://i.ibb.co.com/7dPT0LX2/30ad3fc61803922fec84f5a2798ab18904d9635f.jpg"
            alt="Login Visual"
            className="rounded-2xl w-full h-full object-cover"
          />
        </div>

        <div className="w-full xl:w-[35%] lg:w-[50%] flex items-center justify-center px-6">
          <div className="w-full">
            <h1 className="Auth_section_title mb-2 xl:text-[36px] md:text-[28px] text-[20px] lg:text-start text-center">
              Welcome Back to Terralink!
            </h1>
            <p className="text-[#404040] mb-8 lg:text-start text-center">
              Sign in your account
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-lg text-[#5F5F5F] mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue"
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
                <label className="block text-lg text-[#5F5F5F]  mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    {...register("password", {
                      required: "Password is required",
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-primary-blue"
                    {...register("remember")}
                  />
                  Remember Me
                </label>

                <a
                  href="/auth/forgot-password"
                  className="text-sm text-gray-500 hover:text-primary-blue"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-blue text-white py-3 rounded-lg hover:bg-blue-600 transition cursor-pointer"
              >
                {isPending ? (
                  <PiSpinnerBold className="animate-spin size-[20px] fill-white mx-auto" />
                ) : (
                  "Login"
                )}
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-sm text-gray-400">Or</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              {/* GOOGLE LOGIN BUTTON */}
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={isGooglePending}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-[#E6F3FF] hover:bg-blue-100 transition cursor-pointer disabled:opacity-70"
              >
                {isGooglePending ? (
                  <PiSpinnerBold className="animate-spin size-[20px] fill-primary-blue mx-auto" />
                ) : (
                  <>
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span className="text-[#5F5F5F] lg:text-xl text-lg font-medium">
                      Sign in with Google
                    </span>
                  </>
                )}
              </button>

              <p className="text-center text-gray-500">
                Don’t have any account?{" "}
                <a
                  href="/auth/register"
                  className="text-primary-blue font-medium hover:underline"
                >
                  Register
                </a>
              </p>

              {/* Home Navigation */}
              <div className="text-center mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-blue transition"
                >
                  <IoHomeOutline className="text-base" />
                  Back to Home
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
