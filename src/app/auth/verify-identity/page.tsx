"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import Container from "@/Components/Common/Container";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

type OTPFormData = {
  otp: string;
};

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OTPFormData>({
    defaultValues: {
      otp: "",
    },
  });

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const fullOtp = otpDigits.join("");
    setValue("otp", fullOtp, { shouldValidate: fullOtp.length === 4 });
  }, [otpDigits, setValue]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value; 
    setOtpDigits(newDigits);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (paste) {
      const newDigits = paste.split("").concat(["", "", "", ""]).slice(0, 4);
      setOtpDigits(newDigits);

      const nextIndex = paste.length < 4 ? paste.length : 3;
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const onSubmit = (data: OTPFormData) => {
    console.log("Submitted OTP:", data.otp);
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
          <div className="w-full">
            <h1 className="Auth_section_title mb-2 xl:text-[36px] md:text-[28px] text-[24px] lg:text-start text-center">
              Verify your identity
            </h1>
            <p className="text-[#404040] my-8 lg:text-lg text-base lg:text-start text-center">
              Please enter the OTP sent to{" "}
              <span className="text-[#0085FF] cursor-pointer">
                demo@gmail.com
              </span>{" "}
              to continue{" "}
              <span className="text-[#0085FF] cursor-pointer underline">
                Change Email
              </span>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <input
                type="hidden"
                {...register("otp", {
                  required: "OTP is required",
                  pattern: {
                    value: /^\d{4}$/,
                    message: "Please enter a valid 4-digit OTP",
                  },
                })}
              />

              <div>
                <label className="block text-lg text-[#5F5F5F] mb-4 font-medium">
                  Enter Your OTP Code
                </label>
                <div
                  className="flex gap-4 justify-center lg:justify-start"
                  onPaste={handlePaste}
                >
                  {[0, 1, 2, 3].map(index => (
                    <input
                      key={index}
                      ref={el => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpDigits[index]}
                      onChange={e => handleChange(index, e.target.value)}
                      onKeyDown={e => handleKeyDown(index, e)}
                      className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-xl focus:border-primary-blue focus:outline-none transition-all"
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  ))}
                </div>

                {errors.otp && (
                  <p className="text-red-500 text-sm mt-3 text-center lg:text-start">
                    {errors.otp.message}
                  </p>
                )}
              </div>
              <p className=" text-gray-500">
                Resend OTP in{" "}
                <a className="text-primary-blue font-medium hover:underline">
                  58 s
                </a>
              </p>
              <p className=" text-gray-500">
                Know your password?{" "}
                <a
                  href="/auth/login"
                  className="text-primary-blue font-medium hover:underline"
                >
                  Sign in
                </a>
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary-blue text-white py-3 rounded-lg hover:bg-blue-600 transition cursor-pointer"
              >
                Confirm
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

export default Page;
