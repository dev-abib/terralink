"use client";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AddFavourite } from "@/Hooks/api/post_api";
import Container from "@/Components/Common/Container";
import {
  Acceleration,
  Bathtub,
  Bed,
  Favourite,
  Favourites,
  Location,
} from "@/Components/Svg/SvgContainer";
import { FeaturedSkeleton } from "@/Components/Skeleton/FeaturedSkeleton";

interface PropertyProps {
  data: any[];
}

const Featured = ({ data = [] }: PropertyProps) => {
  const { mutate } = AddFavourite();
  const [showAll, setShowAll] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loadingFavorites, setLoadingFavorites] = useState<
    Record<string, boolean>
  >({});
  // State to manage which image is displayed in the popup
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Get token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Handle Escape key and body scroll when modal is open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  // Check if current page is buyer layout
  const pathname = usePathname();
  const isBuyerLayout = pathname.startsWith("/buyerlayout");

  // Show only 6 properties initially, show all when "View All" is clicked
  const displayedProperties = showAll ? data : data.slice(0, 6);

  // Initialize favorite states from data
  const [favoriteStates, setFavoriteStates] = useState<{
    [key: string]: boolean;
  }>(
    Object.fromEntries(data.map(item => [item._id, item.isFavorite || false])),
  );

  // Handle toggle favorite
  const toggleFavorite = (id: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add favourites");
      return;
    }

    setLoadingFavorites(prev => ({ ...prev, [id]: true }));

    // Optimistically update UI
    setFavoriteStates(prev => ({
      ...prev,
      [id]: !prev[id],
    }));

    // Make API call
    mutate(
      {
        endpoint: `/toggle-favourite-listing/${id}`,
      },
      {
        onSettled: () => {
          setLoadingFavorites(prev => ({ ...prev, [id]: false }));
        },
        onError: () => {
          // Revert on error
          setFavoriteStates(prev => ({
            ...prev,
            [id]: !prev[id],
          }));
        },
      },
    );
  };

  // Show skeleton if no properties
  if (!displayedProperties || displayedProperties.length === 0) {
    return <FeaturedSkeleton />;
  }

  return (
    <>
      {/* Main Featured Section */}
      <section className="py-12 sm:py-16 md:py-24 xl:py-[150px]">
        <Container>
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-2 sm:px-0">
            <h2 className="font-medium text-black text-2xl sm:text-3xl md:text-4xl lg:text-[38px]">
              Featured Properties
            </h2>
            <p className="font-normal text-black text-sm sm:text-base lg:text-[18px] mt-3 sm:mt-4 max-w-3xl mx-auto px-2 sm:px-0">
              Explore top-tier homes and land carefully curated for quality and
              value.
            </p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 xl:gap-11">
            {displayedProperties?.map((item: any) => (
              <div
                key={item._id}
                className="bg-white shadow-lg rounded-2xl sm:rounded-[28px] overflow-hidden group hover:shadow-2xl transition-all duration-500 px-3 sm:px-4 md:px-4.5 pt-3 sm:pt-4 md:pt-4.5 pb-5 sm:pb-6 md:pb-7.5"
              >
                {/* Property Image with Clickable Overlay */}
                <div className="relative overflow-hidden">
                  <figure className="h-[220px] sm:h-[250px] md:h-[280px] lg:h-[300px] overflow-hidden cursor-pointer rounded-lg relative group/image">
                    {/* Property Image */}
                    <Image
                      src={item.media?.[0]?.url}
                      alt={item.propertyName}
                      width={500}
                      height={300}
                      onClick={() => setSelectedImage(item.media?.[0]?.url)}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 rounded-lg"
                    />

                    {/* Hover Overlay with Click Indicator */}
                    <div
                      className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-all duration-300 rounded-lg flex items-center justify-center cursor-pointer"
                      onClick={() => setSelectedImage(item.media?.[0]?.url)}
                    >
                      {/* Magnifying Glass Icon & Text - Show on Hover */}
                      <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                        {/* Icon Background */}
                        <div className="bg-white/95 p-3 rounded-full">
                          {/* Magnifying Glass SVG Icon */}
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                            />
                          </svg>
                        </div>
                        {/* Click to View Text */}
                        <span className="text-white font-medium text-sm">
                          Click to view
                        </span>
                      </div>
                    </div>
                  </figure>

                  {/* Favorite Button */}
                  <div
                    onClick={() =>
                      !loadingFavorites[item._id] && toggleFavorite(item._id)
                    }
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full cursor-pointer hover:bg-white transition-colors z-10"
                  >
                    {loadingFavorites[item._id] ? (
                      // Loading spinner
                      <span className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : favoriteStates[item._id] ? (
                      // Filled heart (favorited)
                      <Favourites />
                    ) : (
                      // Empty heart (not favorited)
                      <Favourite />
                    )}
                  </div>
                </div>

                {/* Property Details */}
                <div className="mt-3 sm:mt-4 md:mt-5">
                  {/* Price */}
                  <h3
                    className="text-lg sm:text-xl lg:text-2xl xl:text-[28px] font-bold text-[#0085FF]"
                    translate="no"
                  >
                    {new Intl.NumberFormat().format(item.price)}
                    <span className="text-sm sm:text-base lg:text-[18px] font-medium text-[#919191] pl-1">
                      USD
                    </span>
                  </h3>

                  {/* Property Name */}
                  <h4
                    className="text-sm sm:text-base lg:text-lg xl:text-[24px] font-medium text-[#5F5F5F] mt-2 sm:mt-3"
                    translate="no"
                  >
                    {item.propertyName?.length > 25
                      ? item.propertyName.substring(0, 25) + "..."
                      : item.propertyName}
                  </h4>

                  {/* Location */}
                  <div className="flex items-center gap-2 mt-3 sm:mt-4">
                    <Location className="w-4 h-4 sm:w-[18px] sm:h-[18px] 2xl:w-[24px] 2xl:h-[24px]" />
                    <p
                      className="text-sm sm:text-base lg:text-lg xl:text-[18px] font-medium text-[#919191]"
                      translate="no"
                    >
                      {item.city}, {item.state}
                    </p>
                  </div>

                  {/* Property Features: Beds, Baths, Area */}
                  <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-5 mt-3 sm:mt-4 md:mt-5">
                    {/* Bedrooms */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                      <Bed className="shrink-0 scale-90 sm:scale-100" />
                      <span
                        className="text-xs sm:text-sm lg:text-[14px] font-normal text-[#919191]"
                        translate="no"
                      >
                        {item.bedrooms} Bed
                      </span>
                    </div>
                    {/* Bathrooms */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                      <Bathtub className="shrink-0 scale-90 sm:scale-100" />
                      <span
                        className="text-xs sm:text-sm lg:text-[14px] font-normal text-[#919191]"
                        translate="no"
                      >
                        {item.bathrooms} Bath
                      </span>
                    </div>
                    {/* Area in Square Meters */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                      <Acceleration className="shrink-0 scale-90 sm:scale-100" />
                      <span
                        className="text-xs sm:text-sm lg:text-[14px] font-normal text-[#919191]"
                        translate="no"
                      >
                        {item.areaInSqMeter} m²
                      </span>
                    </div>
                  </div>

                  {/* Contact Button */}
                  <Link
                    href={`${isBuyerLayout ? `/buyerlayout/browse/${item._id}` : `/browse/${item._id}`}`}
                  >
                    <button className="mt-5 sm:mt-6 md:mt-8 w-full bg-[#0085FF] text-white font-medium text-sm sm:text-base lg:text-lg py-3 sm:py-3 xl:py-4 rounded-xl sm:rounded-2xl hover:bg-transparent hover:text-[#0085FF] border border-[#0085FF] transition-all duration-300 cursor-pointer">
                      Contact
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Properties Button */}
          {!showAll && data.length > 6 && (
            <div className="text-center mt-8 sm:mt-10 md:mt-12 lg:mt-16">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-3 bg-[#0085FF] text-white font-medium text-sm sm:text-base lg:text-lg px-6 sm:px-8 md:px-10 xl:py-4 py-3 rounded-xl sm:rounded-2xl transition-colors duration-300 shadow-lg hover:shadow-xl cursor-pointer hover:bg-transparent hover:text-black border border-blue-600"
              >
                View All Properties
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* Full-Screen Image Popup Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl h-[90vh] w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button (X) */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 sm:-top-10 sm:right-0 bg-black/60 sm:bg-transparent rounded-full sm:rounded-none text-white hover:text-gray-300 transition-colors p-2 cursor-pointer z-10"
              aria-label="Close modal"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image Display Container */}
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={selectedImage}
                alt="Property full view"
                fill
                priority
                className="rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Featured;
