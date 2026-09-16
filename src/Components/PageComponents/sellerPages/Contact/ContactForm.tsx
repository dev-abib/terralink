"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { CiLinkedin } from "react-icons/ci";
import { PiSpinnerBold } from "react-icons/pi";
import { RiTwitterXFill } from "react-icons/ri";
import { useContact } from "@/Hooks/api/post_api";
import { SiteSettings } from "@/Hooks/api/cms_api";
import { LiaFacebookSquare } from "react-icons/lia";
import Container from "@/Components/Common/Container";
import { FaInstagram, FaWhatsapp, FaTelegram, FaYoutube } from "react-icons/fa";

type ContactFormData = {
  subject: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  message: string;
};

const socialIcons: Record<string, any> = {
  facebook: LiaFacebookSquare,
  instagram: FaInstagram,
  linkedin: CiLinkedin,
  x: RiTwitterXFill,
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,
  youtube: FaYoutube,
};

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>();

  const { data } = SiteSettings();
  const { mutate, isPending } = useContact();

  const onSubmit = (formData: ContactFormData) => {
    mutate(formData);
  };

  return (
    <section className="lg:pt-[150px] pt-12 sm:pt-16">
      <Container>
        <div className="lg:flex gap-10 lg:gap-16 xl:gap-20">
          <div className="w-full">
            <h3 className="xl:text-[24px] md:text-[20px] text-lg font-semibold text-[#404040]">
              Send Us a Message
            </h3>
            <p className="xl:text-[20px] md:text-base text-sm font-medium text-[#5F5F5F] pt-4">
              Whether you're a buyer, seller, or agent — we're just a message
              away.
            </p>
            <form
              className="pt-10 flex flex-col gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Full Name */}
              <div>
                <label className="block xl:text-lg text-base text-[#5F5F5F] mb-2 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-6 py-3 rounded-lg bg-[#F3F3F5] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue text-base"
                  {...register("fullName", { required: "Name is required" })}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block xl:text-lg text-base text-[#5F5F5F] mb-2 font-medium">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-6 py-3 rounded-lg bg-[#F3F3F5] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue text-base"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block xl:text-lg text-base text-[#5F5F5F] mb-2 font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full px-6 py-3 rounded-lg bg-[#F3F3F5] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue text-base"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block xl:text-lg text-base text-[#5F5F5F] mb-2 font-medium">
                  Subject *
                </label>
                <input
                  type="text"
                  placeholder="Write a short subject"
                  className="w-full px-6 py-3 rounded-lg bg-[#F3F3F5] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue text-base"
                  {...register("subject", { required: "Subject is required" })}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block xl:text-lg text-base text-[#5F5F5F] mb-2 font-medium">
                  Message *
                </label>
                <textarea
                  placeholder="Write Message..."
                  className="w-full px-6 py-3 h-[150px] rounded-lg bg-[#F3F3F5] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue text-base"
                  {...register("message", { required: "Message is required" })}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-primary-blue text-white md:py-4.5 py-3 rounded-lg hover:bg-blue-600 transition cursor-pointer flex justify-center items-center"
              >
                {isPending ? (
                  <PiSpinnerBold className="animate-spin size-[20px] fill-white" />
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          <div className="w-full lg:mt-0 mt-10">
            <h3 className="xl:text-[24px] md:text-[20px] text-lg font-semibold text-[#404040]">
              We're Here to Help
            </h3>
            <p className="xl:text-[20px] md:text-base text-sm font-medium text-[#5F5F5F] pt-4">
              Connect with Terralink — your trusted partner in real estate.
            </p>

            <div className="mt-10 xl:p-10 p-5 border border-[#E7E7E7] rounded-[28px]">
              <h3 className="xl:text-[24px] md:text-[20px] text-lg font-semibold text-[#404040]">
                Contact Information
              </h3>
              <div className="mt-10 flex flex-col gap-7">
                {/* <div>
                  <h4 className="xl:text-[24px] md:text-[20px] text-lg font-semibold text-[#339DFF]">
                    Office Address:
                  </h4>
                  <h5 className="xl:text-[20px] md:text-base text-sm font-normal text-[#5F5F5F] pt-3">
                    {data?.data?.address}
                  </h5>
                </div> */}
                <div>
                  <h4 className="xl:text-[24px] md:text-[20px] text-lg font-semibold text-[#339DFF]">
                    Email:
                  </h4>
                  <h5 className="xl:text-[20px] md:text-base text-sm font-normal text-[#5F5F5F] pt-3">
                    {data?.data?.email}
                  </h5>
                </div>
                <div>
                  <h4 className="xl:text-[24px] md:text-[20px] text-lg font-semibold text-[#339DFF]">
                    Phone:
                  </h4>
                  <h5 className="xl:text-[20px] md:text-base text-sm font-normal text-[#5F5F5F] pt-3">
                    {data?.data?.phoneNumber}
                  </h5>
                </div>
                <div>
                  <h4 className="xl:text-[24px] md:text-[20px] text-lg font-semibold text-[#339DFF]">
                    Business Hours:
                  </h4>
                  <h5 className="xl:text-[20px] md:text-base text-sm font-normal text-[#5F5F5F] pt-3">
                    {data?.data?.openingHour}
                  </h5>
                </div>
              </div>
            </div>

            <div className="mt-7 xl:p-10 p-5 border border-[#E7E7E7] rounded-[28px]">
              <h3 className="text-[24px] font-semibold text-[#404040]">
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-8 mt-7">
                {data?.data?.socialLinks &&
                  Object.entries(data.data.socialLinks).map(([key, url]) => {
                    if (!url || typeof url !== "string") return null;
                    const Icon = socialIcons[key];
                    if (!Icon) return null;
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#339DFF] text-2xl hover:opacity-80 transition"
                      >
                        <Icon />
                      </a>
                    );
                  })}
              </div>
            </div>
            {/* <div className="w-full h-[500px] mt-7 xl:flex hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58420.16573309009!2d90.36343509144125!3d23.77374133110238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c769ad5e7f6f%3A0x1d928a50d9cbcc90!2sSKS%20Shopping%20Mall!5e0!3m2!1sen!2sbd!4v1766118436976!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
              />
            </div> */}
          </div>
        </div>
        {/* <div className="w-full h-[500px] mt-7 lg:hidden flex">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58420.16573309009!2d90.36343509144125!3d23.77374133110238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c769ad5e7f6f%3A0x1d928a50d9cbcc90!2sSKS%20Shopping%20Mall!5e0!3m2!1sen!2sbd!4v1766118436976!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl"
          />
        </div> */}
      </Container>
    </section>
  );
};

export default ContactForm;
