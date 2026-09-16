"use client";
import React from "react";
import Image from "next/image";
import { MdDelete, MdEdit } from "react-icons/md";
import { BsCalendar3, BsEye, BsFillChatDotsFill } from "react-icons/bs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  GetStatistics,
  useAlllisting,
  useDelete,
} from "@/Hooks/api/dashboard_api";
import Link from "next/link";
import Container from "@/Components/Common/Container";
import { MyListingSkeleton } from "@/Components/Skeleton/MyListingSkeleton";

const Analytics = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { data: apiData, isLoading } = GetStatistics(token);
  const { mutate: deleteListing, isLoading: isDeleting } = useDelete();
  const { data: alllisting } = useAlllisting(token);
  const items = alllisting?.data?.items || [];

  const chartData =
    apiData?.data?.analytics?.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      }),
      views: item.views,
      leads: item.leads,
    })) || [];

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
      <h2 className="text-[#404040] lg:text-[28px] text-[24px] font-medium">
        Performance Analytics
      </h2>
      <h5 className="lg:text-[18px] text-base text-[#5F5F5F] font-normal mt-3">
        Track how your listings are performing in real time
      </h5>

      <div className="my-10 bg-[#F5F5F5] rounded-[28px] lg:p-8 p-3 shadow-sm border border-[#E7E7E7]">
        <div className="mb-6">
          <h3 className="text-[22px] font-medium text-[#101010]">
            Views Over Time
          </h3>
          <p className="text-[16px] text-[#5F5F5F] mt-1">
            Daily property views and lead generation
          </p>
        </div>

        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0085FF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0085FF" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E7E7E7" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#5F5F5F", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#5F5F5F", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E7E7E7",
                  borderRadius: "12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={value => (
                  <span className="text-[#5F5F5F]">{value}</span>
                )}
              />

              <Area
                type="monotone"
                dataKey="leads"
                stroke="#4ADE80"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorLeads)"
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#0085FF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Listings section */}
      <div className="mt-10 sm:mt-14">
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

export default Analytics;
