import React from "react";
import Link from "next/link";
import { IoHomeOutline } from "react-icons/io5";

const NotFound = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center bg-[#F9FAFB]">
      <div className="w-24 h-24 mb-6 rounded-full bg-blue-50 border-2 border-[#0085FF] flex items-center justify-center">
        <span className="text-4xl font-black text-[#0085FF]">404</span>
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-sm sm:text-base text-gray-500 max-w-md mb-8">
        Sorry, the page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#0085FF] text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition shadow-md hover:shadow-lg"
      >
        <IoHomeOutline className="text-lg" />
        Back to Home
      </Link>
    </main>
  );
};

export default NotFound;
