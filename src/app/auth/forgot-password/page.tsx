"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { PiSpinnerBold } from "react-icons/pi";
import Container from "@/Components/Common/Container";
import { useForgotPassWord } from "@/Hooks/api/auth_api";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

type LoginFormData = {
  email: string;
};

const page = () => {
  const { mutate, isPending } = useForgotPassWord();
  const {
    register,
    handleSubmit,
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
              Forgot your password?
            </h1>
            <p className="text-[#404040] mb-8 lg:text-lg text-base lg:text-start text-center ">
              Enter your email address, and we’ll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
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

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-primary-blue text-white py-3 rounded-lg hover:bg-blue-600 transition cursor-pointer"
              >
                {isPending ? (
                  <PiSpinnerBold className="animate-spin size-[20px] fill-white mx-auto" />
                ) : (
                  "Send"
                )}
              </button>
              <p className="text-center text-gray-500">
                Know your password?
                <a
                  href="/auth/login"
                  className="text-primary-blue font-medium hover:underline"
                >
                  Sign in
                </a>
              </p>
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
