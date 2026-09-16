"use client";

import Link from "next/link";
import { useState } from "react";
import { FiBell } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

type SavedSearch = {
  id: number;
  title: string;
  newListings: number;
  alertsOn: boolean;
};

const SavedSearches = () => {
  const [searches, setSearches] = useState<SavedSearch[]>([
    {
      id: 1,
      title: "Condos in Carcha City under $500k",
      newListings: 23,
      alertsOn: true,
    },
    {
      id: 2,
      title: "Condos in Caquiton City under $500k",
      newListings: 15,
      alertsOn: true,
    },
    {
      id: 3,
      title: "Condos in Sencaai City under $500k",
      newListings: 42,
      alertsOn: true,
    },
  ]);

  const handleDelete = (id: number) => {
    setSearches(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="px-4  lg:px-0 py-10">
      {/* Container */}
      <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#212B36]">
              Save Searches
            </h2>
            <p className="text-sm text-[#919191] mt-1">
              Get alerts when new properties match your criteria
            </p>
          </div>

          <Link
            href="/buyerlayout/browse"
            className="bg-primary-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition text-center cursor-pointer"
          >
            Create New Search
          </Link>
        </div>

        {/* List */}
        <div className="space-y-4">
          {searches.map(item => (
            <div
              key={item.id}
              className="bg-white border border-[#F1F1F1] rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:shadow-md transition"
            >
              {/* Left */}
              <div>
                <h3 className="text-sm sm:text-base font-medium text-[#212B36]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#919191] mt-1">
                  {item.newListings} new listings
                </p>
              </div>

              {/* Middle Badge */}
              {item.alertsOn && (
                <div className="flex items-center gap-2 bg-[#E9FFF1] text-[#0D8A3D] px-3 py-1.5 rounded-lg text-xs font-medium w-fit">
                  <FiBell className="text-sm" />
                  Alerts on
                </div>
              )}

              {/* Right Actions */}
              <div className="flex items-center gap-4">
                <button className="border border-[#E7E7E7] px-4 py-2 rounded-lg text-sm text-[#212B36] hover:bg-gray-100 transition cursor-pointer">
                  View Results
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-600 transition cursor-pointer"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedSearches;
