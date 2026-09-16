"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BsPlusLg,
  BsEye,
  BsFillChatDotsFill,
  BsCalendar3,
} from "react-icons/bs";
import { MdEdit, MdDelete } from "react-icons/md";
import Container from "@/Components/Common/Container";
import { useAlllisting, useDelete } from "@/Hooks/api/dashboard_api";
import { MyListingSkeleton } from "@/Components/Skeleton/MyListingSkeleton";

const MyListing = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { data: alllisting, isLoading } = useAlllisting(token);
  const { mutate: deleteListing, isLoading: isDeleting } = useDelete();
  const items = alllisting?.data?.items || [];

  const handleDelete = (listingId: string) => {
    const currentToken = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this listing?")) {
      deleteListing({
        endpoint: `/delete-property/${listingId}`,
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
    }
  };

  if (isLoading) {
    return <MyListingSkeleton />;
  }

  return (
    <Container>
      <div className="md:flex justify-between items-end">
        <div>
          <h2 className="text-[#404040] lg:text-[28px] text-[24px] font-medium">
            My Listings
          </h2>
          <h5 className="lg:text-[18px] text-base text-[#5F5F5F] font-normal mt-3">
            Manage your property listings
          </h5>
        </div>
        <Link href={"/seller/new-listing"}>
          <button className="flex md:mt-0 mt-3 gap-x-1 items-center bg-[#0085FF] px-5 py-3 rounded-[12px] cursor-pointer text-white group hover:text-black hover:bg-transparent duration-300 ease-in-out border border-[#0085FF]">
            <BsPlusLg className="text-white group-hover:text-black" />
            Add New Listing
          </button>
        </Link>
      </div>

      <div className="mt-6 sm:mt-8">
        <div className="bg-[#F5F5F5] p-2 lg:p-10 rounded-[28px] flex flex-col gap-5">
          {items.length > 0 ? (
            items.map((item: any) => (
              <div
                key={item._id}
                className="bg-white border border-[#E7E7E7] px-5 py-7 rounded-[28px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-5 flex-1">
                  <figure className="shrink-0 w-full lg:w-auto mb-4 lg:mb-0">
                    <Image
                      src={item?.media?.[0]?.url || "/placeholder.png"}
                      alt={item?.propertyName}
                      width={400}
                      height={300}
                      className="w-full lg:w-[180px] lg:h-[150px] h-[300px] rounded-[16px] object-cover"
                    />
                  </figure>

                  <div className="flex-1 w-full">
                    <h3 className="lg:text-[24px] text-[20px] font-medium text-[#404040]" translate="no">
                      {item.propertyName}
                    </h3>
                    <p className="lg:text-[20px] text-base font-medium text-[#919191] mt-1" translate="no">
                      {item.fullAddress}, {item.city}, {item.state}
                    </p>

                    <div className="flex flex-wrap gap-4 lg:gap-6 mt-4 text-[18px] text-[#5F5F5F]">
                      <span className="flex items-center gap-2">
                        <BsEye /> {item.views || 0} views
                      </span>
                      <span className="flex items-center gap-2">
                        <BsFillChatDotsFill /> {item.leads || 0} leads
                      </span>
                      <span className="flex items-center gap-2">
                        <BsCalendar3 /> Posted:{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                      <Link href={`/seller/browse/${item._id}`}>
                        <button className="flex items-center cursor-pointer gap-1 border border-[#E7E7E7] px-2.5 py-1 rounded-[12px] text-[#5F5F5F] hover:bg-gray-50 transition">
                          <BsEye className="text-lg" /> View Post
                        </button>
                      </Link>
                      <Link href={`/seller/edit-listing/${item._id}`}>
                        <button className="flex items-center cursor-pointer gap-1 border border-[#E7E7E7] px-2.5 py-1 rounded-[12px] text-[#5F5F5F]">
                          <MdEdit className="text-lg" /> Edit
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={isDeleting}
                        className="flex items-center cursor-pointer gap-1 border border-[#FCC9CB] text-[#E7000B] px-2.5 py-1 rounded-[12px] bg-[#FFE9EA] hover:bg-[#ffdadc] transition-colors disabled:opacity-50"
                      >
                        <MdDelete className="text-lg" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center lg:text-right shrink-0 mt-6 lg:mt-0">
                  <p className="text-[28px] font-bold text-[#0085FF]" translate="no">
                    ${item.price}
                    <span className="text-[#919191] text-[18px] font-normal ml-1">
                      {" "}
                      USD
                    </span>
                  </p>
                  <div className="inline-flex items-center gap-1 border border-[#E7E7E7] px-6 py-2.5 rounded-[12px] mt-4 text-[16px] font-medium text-[#5F5F5F]">
                    {item.listingType}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500">
              No listings found.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default MyListing;
