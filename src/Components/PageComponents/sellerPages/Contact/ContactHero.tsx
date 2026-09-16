"use client";
import React from "react";
import { ConatctUs } from "@/Hooks/api/cms_api";
import Container from "@/Components/Common/Container";

const ContactHero = () => {
  const { data } = ConatctUs();
  return (
    <section
      className="pt-28 sm:pt-32 lg:pt-36 lg:pb-[280px] pb-20 contacthero"
      style={{
        backgroundImage: data?.data?.bgImg
          ? `url(${data?.data?.bgImg})`
          : "url('/Assets/aboutbanner.png')",
      }}
    >
      <Container>
        <h2 className="text-center font-bold lg:text-[56px] md:text-[48px] text-[32px] text-white">
          {data?.data?.title}
        </h2>
        <p className="text-center font-medium lg:text-[20px] text-base text-white max-w-[750px] mx-auto mt-3">
          {data?.data?.subtitle}
        </p>
      </Container>
    </section>
  );
};

export default ContactHero;
