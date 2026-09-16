"use client";

import Link from "next/link";

interface heroprops {
  hero: any;
}

const SellerPageHero = ({ hero }: heroprops) => {
  console.log(hero);

  return (
    <section
      className="w-full bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: hero?.data?.bgImg
          ? `url(${hero?.data?.bgImg})`
          : "url('/Assets/mainhero.png')",
      }}
    >
      <div className="w-full h-full bg-black/50 px-6 py-20 sm:py-24 lg:py-28 flex items-center justify-center">
        <div className="max-w-3xl text-center text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
            {hero?.data?.title}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-white/90">
            {hero?.data?.subtitle}
          </p>
          <Link href={"/seller/pricing"}>
            <button className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#2F80ED] px-8 py-4 text-white text-base font-medium hover:opacity-90 transition cursor-pointer">
              {hero?.data?.btnTxt}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SellerPageHero;
