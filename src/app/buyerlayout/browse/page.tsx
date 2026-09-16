"use client";
import {
  Acceleration,
  Bathtub,
  Bed,
  Favourite,
  Favourites,
  Location,
} from "@/Components/Svg/SvgContainer";
import Link from "next/link";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  AngleBottomSvg,
  SideBarCloseSvg,
} from "@/Components/Svg/SvgContainer2";
import { ListPropertyBrowse, useGetProperties } from "@/Hooks/api/cms_api";
import { BrowseDetailsSkeleton } from "@/Components/Skeleton/BrowseDetailsSkeleton";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import PropertyMapPin from "@/Components/Map/PropertyMapPin";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AddFavourite, usePropertyView } from "@/Hooks/api/post_api";

// ─── Shared Filter Panel (Mobile) ───────────────────────────────────────────────
const FilterPanel = ({
  listingType,
  setListingType,
  propertyType,
  setPropertyType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  location,
  setLocation,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  handleSearch,
  handleClear,
  onClose,
}: any) => (
  <div className="rounded-2xl border border-[#E7E7E7] shadow-[0_0_8px_0_rgba(145,158,171,0.24)] bg-white p-6">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">Filters</h2>
      {onClose && (
        <span onClick={onClose} className="text-gray-400 cursor-pointer">
          <SideBarCloseSvg />
        </span>
      )}
    </div>

    {/* Buy or Rental Tab Switcher */}
    <div className="mb-6">
      <div className="flex bg-[#F3F3F4] p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setListingType("buy")}
          className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all cursor-pointer ${
            listingType === "buy"
              ? "bg-white text-primary-blue shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setListingType("rent")}
          className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all cursor-pointer ${
            listingType === "rent"
              ? "bg-white text-primary-blue shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Rent
        </button>
      </div>
    </div>

    {/* PROPERTY TYPE */}
    <div className="mb-6">
      <h3 className="font-medium mb-3">Property Type</h3>
      {["All", "House", "Land", "Commercial"].map(type => (
        <label
          key={type}
          className="flex items-center gap-3 mb-3 cursor-pointer"
        >
          <input
            type="radio"
            name="propertyType"
            checked={propertyType === type}
            onChange={() => setPropertyType(type)}
            className="h-4 w-4 accent-primary-blue"
          />
          <span className="text-gray-700">{type}</span>
        </label>
      ))}
    </div>

    {/* PRICE RANGE */}
    <div className="mb-6">
      <h3 className="font-medium mb-3">Price Range</h3>
      <div className="flex items-center gap-3">
        <input
          type="number"
          placeholder="$10k"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          className="w-full rounded-lg border border-[#C4CDD5] px-3 py-2 text-sm"
        />
        <span className="text-sm text-gray-500">To</span>
        <input
          type="number"
          placeholder="$500k"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="w-full rounded-lg border border-[#C4CDD5] px-3 py-2 text-sm"
        />
      </div>
    </div>

    {/* LOCATION */}
    <div className="mb-6">
      <h3 className="font-medium mb-3">Location</h3>
      <input
        placeholder="City or State"
        value={location}
        onChange={e => setLocation(e.target.value)}
        className="w-full rounded-lg border border-[#C4CDD5] px-3 py-2 text-sm"
      />
    </div>

    {/* FEATURE */}
    <div className="mb-6">
      <h3 className="font-medium mb-3">Feature</h3>
      <p className="text-sm text-gray-600 mb-2">Bedrooms</p>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num}
            onClick={() => setBedrooms(num)}
            className={`h-9 w-9 rounded-lg border border-[#C4CDD5] text-sm cursor-pointer ${
              bedrooms === num
                ? "bg-primary-blue text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {num === 5 ? "5+" : num}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 mb-2">Bathrooms</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num}
            onClick={() => setBathrooms(num)}
            className={`h-9 w-9 rounded-lg border border-[#C4CDD5] text-sm cursor-pointer ${
              bathrooms === num
                ? "bg-primary-blue text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {num === 5 ? "5+" : num}
          </button>
        ))}
      </div>
    </div>

    {/* ACTION BUTTONS */}
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSearch}
        className="w-full rounded-xl cursor-pointer bg-primary-blue py-3 text-white text-sm font-medium hover:opacity-90 transition"
      >
        Search
      </button>
      <button
        onClick={handleClear}
        className="w-full rounded-xl cursor-pointer border border-gray-300 bg-white py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition"
      >
        Clear Filters
      </button>
    </div>
  </div>
);

// ─── Horizontal Filter Bar (Desktop) ─────────────────────────────────────────
const HorizontalFilterBar = ({
  listingType,
  setListingType,
  propertyType,
  setPropertyType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  location,
  setLocation,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  handleSearch,
  handleClear,
}: any) => {
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showBedDropdown, setShowBedDropdown] = useState(false);
  const [showBathDropdown, setShowBathDropdown] = useState(false);
  const propRef = useRef<HTMLDivElement>(null);
  const bedRef = useRef<HTMLDivElement>(null);
  const bathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (propRef.current && !propRef.current.contains(e.target as Node)) setShowPropertyDropdown(false);
      if (bedRef.current && !bedRef.current.contains(e.target as Node)) setShowBedDropdown(false);
      if (bathRef.current && !bathRef.current.contains(e.target as Node)) setShowBathDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="rounded-2xl border border-[#E7E7E7] shadow-[0_0_8px_0_rgba(145,158,171,0.24)] bg-white p-5 lg:p-6">
      <div className="flex flex-wrap items-end justify-between gap-y-4 lg:gap-x-6">
        {/* Buy / Rent */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</label>
          <div className="flex bg-[#F3F3F4] p-0.5 rounded-lg">
            <button
              onClick={() => setListingType("buy")}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                listingType === "buy" ? "bg-white text-primary-blue shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setListingType("rent")}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                listingType === "rent" ? "bg-white text-primary-blue shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Rent
            </button>
          </div>
        </div>

        {/* Property Type Dropdown */}
        <div ref={propRef} className="flex flex-col gap-1.5 relative">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</label>
          <button
            onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[#C4CDD5] rounded-lg bg-white hover:bg-gray-50 transition cursor-pointer min-w-[120px]"
          >
            <span className="flex-1 text-left">{propertyType}</span>
            <AngleBottomSvg />
          </button>
          {showPropertyDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E7E7E7] rounded-lg shadow-lg z-50 overflow-hidden">
              {["All", "House", "Land", "Commercial"].map(type => (
                <button
                  key={type}
                  onClick={() => { setPropertyType(type); setShowPropertyDropdown(false); }}
                  className={`w-full text-left px-3 py-2.5 text-sm transition hover:bg-gray-50 cursor-pointer ${
                    propertyType === type ? "text-primary-blue font-semibold bg-blue-50" : "text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="w-[90px] lg:w-[100px] px-3 py-2.5 text-sm border border-[#C4CDD5] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-blue"
            />
            <span className="text-gray-400 text-sm">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="w-[90px] lg:w-[100px] px-3 py-2.5 text-sm border border-[#C4CDD5] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-blue"
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
          <input
            placeholder="City or State"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-[150px] lg:w-[170px] px-4 py-2.5 text-sm border border-[#C4CDD5] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-blue"
          />
        </div>

        {/* Bedrooms Dropdown */}
        <div ref={bedRef} className="flex flex-col gap-1.5 relative">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Beds</label>
          <button
            onClick={() => setShowBedDropdown(!showBedDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[#C4CDD5] rounded-lg bg-white hover:bg-gray-50 transition cursor-pointer min-w-[80px]"
          >
            <span className="flex-1 text-left">{bedrooms ? `${bedrooms === 5 ? "5+" : bedrooms}` : "Any"}</span>
            <AngleBottomSvg />
          </button>
          {showBedDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E7E7E7] rounded-lg shadow-lg z-50 overflow-hidden">
              <button onClick={() => { setBedrooms(null); setShowBedDropdown(false); }} className="w-full text-left px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer">Any</button>
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => { setBedrooms(num); setShowBedDropdown(false); }}
                  className={`w-full text-left px-3 py-2.5 text-sm transition hover:bg-gray-50 cursor-pointer ${
                    bedrooms === num ? "text-primary-blue font-semibold bg-blue-50" : "text-gray-700"
                  }`}
                >
                  {num === 5 ? "5+" : num}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bathrooms Dropdown */}
        <div ref={bathRef} className="flex flex-col gap-1.5 relative">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Baths</label>
          <button
            onClick={() => setShowBathDropdown(!showBathDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[#C4CDD5] rounded-lg bg-white hover:bg-gray-50 transition cursor-pointer min-w-[80px]"
          >
            <span className="flex-1 text-left">{bathrooms ? `${bathrooms === 5 ? "5+" : bathrooms}` : "Any"}</span>
            <AngleBottomSvg />
          </button>
          {showBathDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E7E7E7] rounded-lg shadow-lg z-50 overflow-hidden">
              <button onClick={() => { setBathrooms(null); setShowBathDropdown(false); }} className="w-full text-left px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer">Any</button>
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => { setBathrooms(num); setShowBathDropdown(false); }}
                  className={`w-full text-left px-3 py-2.5 text-sm transition hover:bg-gray-50 cursor-pointer ${
                    bathrooms === num ? "text-primary-blue font-semibold bg-blue-50" : "text-gray-700"
                  }`}
                >
                  {num === 5 ? "5+" : num}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2 pb-[1px]">
          <button
            onClick={handleSearch}
            className="px-7 py-2.5 rounded-lg bg-primary-blue text-white text-sm font-medium hover:opacity-90 transition cursor-pointer"
          >
            Search
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

const departments = [
  "Atlántida",
  "Choluteca",
  "Colón",
  "Comayagua",
  "Copán",
  "Cortés",
  "El Paraíso",
  "Francisco Morazán",
  "Gracias a Dios",
  "Intibucá",
  "Islas de la Bahía",
  "La Paz",
  "Lempira",
  "Ocotepeque",
  "Olancho",
  "Santa Bárbara",
  "Valle",
  "Yoro",
];

const KNOWN_PROPERTY_TYPES = ["house", "apartment", "land", "commercial"];
const KNOWN_LISTING_TYPES = ["buy", "rent", "for sale", "for rent"];

const normalizeLocation = (loc: string | null | undefined): string | undefined => {
  if (!loc) return undefined;
  const clean = loc.trim();
  if (!clean) return undefined;
  const match = departments.find(
    d =>
      d
        .toLowerCase()
        .replace(/\s+/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") ===
      clean
        .toLowerCase()
        .replace(/\s+/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
  );
  return match || clean;
};

// ─── Page ──────────────────────────────────────────────────────────────────────
const BuyerBrowseContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isBuyerLayout = pathname?.startsWith("/buyerlayout");

  const parseFilters = () => {
    const rawType = searchParams.get("type");
    const rawListingType = searchParams.get("listingType");
    const rawPropertyType = searchParams.get("propertyType");
    const rawLocation = searchParams.get("location");
    const rawMinPrice = searchParams.get("minPrice");
    const rawMaxPrice = searchParams.get("maxPrice");
    const rawMinBedrooms =
      searchParams.get("minBedrooms") || searchParams.get("bedrooms");
    const rawMinBathrooms =
      searchParams.get("minBathrooms") || searchParams.get("bathrooms");
    const rawSort = searchParams.get("sort");

    let propType = rawPropertyType;
    if (
      !propType &&
      rawType &&
      KNOWN_PROPERTY_TYPES.includes(rawType.toLowerCase())
    ) {
      propType = rawType;
    }

    let listType = rawListingType;
    if (
      !listType &&
      rawType &&
      KNOWN_LISTING_TYPES.includes(rawType.toLowerCase())
    ) {
      listType = rawType;
    }

    let backendListingType: string | undefined = undefined;
    if (listType) {
      const lower = listType.toLowerCase();
      if (lower === "rent" || lower === "for rent") {
        backendListingType = "for rent";
      } else if (lower === "buy" || lower === "for sale") {
        backendListingType = "for sale";
      }
    }

    const normLocation = normalizeLocation(rawLocation);

    const filters: Record<string, any> = {
      listingType: backendListingType,
      propertyType:
        !propType || propType.toLowerCase() === "all"
          ? undefined
          : propType.toLowerCase(),
      minPrice: rawMinPrice || undefined,
      maxPrice: rawMaxPrice || undefined,
      location: normLocation || undefined,
      minBedrooms: rawMinBedrooms ? Number(rawMinBedrooms) : undefined,
      minBathrooms: rawMinBathrooms ? Number(rawMinBathrooms) : undefined,
      page: 1,
      limit: 10,
      sort: rawSort || "newest",
    };
    return filters;
  };

  const { mutate } = AddFavourite();
  const [open, setOpen] = useState(false);
  const { data: cta } = ListPropertyBrowse();
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState("Newest First");
  const [loadingFavorites, setLoadingFavorites] = useState<
    Record<string, boolean>
  >({});
  // State for full image modal
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState<any>(parseFilters);

  const [listingType, setListingType] = useState<"buy" | "rent">("buy");
  const [propertyType, setPropertyType] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState("Newest First");

  useEffect(() => {
    const rawType = searchParams.get("type");
    const rawListingType = searchParams.get("listingType");
    const rawPropertyType = searchParams.get("propertyType");
    const rawLocation = searchParams.get("location");
    const rawMinPrice = searchParams.get("minPrice");
    const rawMaxPrice = searchParams.get("maxPrice");
    const rawMinBedrooms =
      searchParams.get("minBedrooms") || searchParams.get("bedrooms");
    const rawMinBathrooms =
      searchParams.get("minBathrooms") || searchParams.get("bathrooms");
    const rawSort = searchParams.get("sort");

    let propType = rawPropertyType;
    if (
      !propType &&
      rawType &&
      KNOWN_PROPERTY_TYPES.includes(rawType.toLowerCase())
    ) {
      propType = rawType;
    }

    let listType = rawListingType;
    if (
      !listType &&
      rawType &&
      KNOWN_LISTING_TYPES.includes(rawType.toLowerCase())
    ) {
      listType = rawType;
    }

    if (listType) {
      const lower = listType.toLowerCase();
      setListingType(lower === "rent" || lower === "for rent" ? "rent" : "buy");
    } else {
      setListingType("buy");
    }

    if (propType) {
      setPropertyType(
        propType.toLowerCase() === "all"
          ? "All"
          : propType.charAt(0).toUpperCase() + propType.slice(1),
      );
    } else {
      setPropertyType("All");
    }

    const normLocation = normalizeLocation(rawLocation);
    setLocation(normLocation || "");
    setMinPrice(rawMinPrice || "");
    setMaxPrice(rawMaxPrice || "");
    setBedrooms(rawMinBedrooms ? Number(rawMinBedrooms) : null);
    setBathrooms(rawMinBathrooms ? Number(rawMinBathrooms) : null);

    if (rawSort) {
      setSelectedSort(
        rawSort === "price asc"
          ? "Price: Low to High"
          : rawSort === "price desc"
            ? "Price: High to Low"
            : rawSort === "most_popular"
              ? "Most Popular"
              : "Newest First",
      );
    }

    setActiveFilters(parseFilters());
  }, [searchParams]);

  // Handle Escape key and body scroll when modal is open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    if (selectedImage) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  const { data, isLoading } = useGetProperties(activeFilters);
  const propertyViewMutation = usePropertyView();
  const listRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 1023 });
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleContact = async (id: string) => {
    if (!id) return;
    try {
      await propertyViewMutation.mutateAsync({
        endpoint: `/property/${id}/view`,
      });
      const targetPath = isBuyerLayout
        ? `/buyerlayout/browse/${id}`
        : `/browse/${id}`;
      router.push(targetPath);
    } catch (err) {
      console.error("Tracking failed, navigating anyway", err);
      const targetPath = isBuyerLayout
        ? `/buyerlayout/browse/${id}`
        : `/browse/${id}`;
      router.push(targetPath);
    }
  };

  const handleSearch = () => {
    const filters: Record<string, any> = {
      listingType:
        listingType === "rent"
          ? "for rent"
          : listingType === "buy"
            ? "for sale"
            : undefined,
      propertyType:
        propertyType === "All" ? undefined : propertyType.toLowerCase(),
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      location: location ? location.trim() : undefined,
      minBedrooms: bedrooms || undefined,
      minBathrooms: bathrooms || undefined,
      page: 1,
      limit: 10,
    };

    if (selectedSort === "Price: Low to High") {
      filters.sort = "price asc";
    } else if (selectedSort === "Price: High to Low") {
      filters.sort = "price desc";
    } else if (selectedSort === "Most Popular") {
      filters.sort = "most_popular";
    } else {
      filters.sort = "newest";
    }

    setActiveFilters(filters);

    const params = new URLSearchParams();
    if (listingType) params.set("type", listingType);
    if (filters.propertyType) params.set("propertyType", filters.propertyType);
    if (filters.location) params.set("location", filters.location);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.minBedrooms)
      params.set("minBedrooms", String(filters.minBedrooms));
    if (filters.minBathrooms)
      params.set("minBathrooms", String(filters.minBathrooms));
    if (filters.sort && filters.sort !== "newest")
      params.set("sort", filters.sort);

    const basePath = isBuyerLayout ? "/buyerlayout/browse" : "/browse";
    const qs = params.toString();
    router.replace(qs ? `${basePath}?${qs}` : basePath);
  };

  const displayedProperties = showAll
    ? data?.data?.items
    : data?.data?.items?.slice(0, 4);

  const [favoriteStates, setFavoriteStates] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const items = data?.data?.items;
    if (items && items.length > 0) {
      const initialFavorites = Object.fromEntries(
        items.map((item: any) => [item._id, item.isFavorite || false]),
      );
      setFavoriteStates(initialFavorites);
    }
  }, [data]);

  const toggleFavorite = (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add favourites");
      return;
    }
    setLoadingFavorites(prev => ({ ...prev, [id]: true }));
    setFavoriteStates(prev => ({ ...prev, [id]: !prev[id] }));
    mutate(
      { endpoint: `/toggle-favourite-listing/${id}` },
      {
        onSettled: () =>
          setLoadingFavorites(prev => ({ ...prev, [id]: false })),
        onError: () =>
          setFavoriteStates(prev => ({ ...prev, [id]: !prev[id] })),
      },
    );
  };

  // const options = [
  //   "Newest First",
  //   "Price: Low to High",
  //   "Price: High to Low",
  //   "Most Popular",
  // ];

  if (isLoading) {
    return <BrowseDetailsSkeleton />;
  }

  const MapContent = ({ properties }: { properties: any[] }) => {
    const map = useMap();

    useEffect(() => {
      if (!map || !properties || properties.length === 0) return;
      const bounds = new google.maps.LatLngBounds();
      properties.forEach(item => {
        if (item.location?.lat && item.location?.lng) {
          bounds.extend({ lat: item.location.lat, lng: item.location.lng });
        }
      });
      map.fitBounds(bounds);
    }, [map, properties]);

    return (
      <Map
        style={{ width: "100%", height: "100%", borderRadius: "12px" }}
        defaultZoom={3}
        gestureHandling="greedy"
        defaultCenter={{ lat: 0, lng: 0 }}
        disableDefaultUI
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "DEMO_MAP_ID"}
      >
        {properties?.map(item => (
          <PropertyMapPin
            key={item._id}
            item={item}
            href={`${isBuyerLayout ? `/buyerlayout/browse/${item._id}` : `/browse/${item._id}`}`}
          />
        ))}
      </Map>
    );
  };

  // shared filter props
  const handleClearFilters = () => {
    setListingType("buy");
    setPropertyType("All");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    setBedrooms(null);
    setBathrooms(null);
    setSelectedSort("Newest First");
    setSelected("Newest First");
    setActiveFilters({});
  };

  const filterProps = {
    listingType,
    setListingType,
    propertyType,
    setPropertyType,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    location,
    setLocation,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    handleSearch,
    handleClear: handleClearFilters,
  };

  return (
    <>
      <div className="px-3 sm:px-4 md:px-6 mb-12 sm:mb-16 md:mb-[100px]">
        {/* ── Header Row ── */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 sm:gap-4 mb-4 lg:mb-6">
          <div className="space-y-1">
            <h2 className="font-semibold text-[#212B36] lg:text-[28px] text-lg sm:text-xl">
              Browse Properties
            </h2>
            <p className="font-normal text-[#212B36] lg:text-base text-xs sm:text-sm">
              Find your perfect property
            </p>
          </div>

          <div className="space-y-1">
            <h2 className="font-semibold text-[#212B36] lg:text-[28px] text-sm sm:text-lg">
              Real Estate & Homes For Rent
            </h2>
            <p className="font-normal text-[#212B36] lg:text-base text-xs sm:text-sm">
              ( Showing {displayedProperties?.length} properties )
            </p>
          </div>

          {/* Sort Dropdown */}
          {/* <div className="w-full md:w-auto">
            <div className="relative w-full lg:w-[220px]">
              <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-2.5 rounded-lg border border-[#E7E7E7] bg-[#F3F3F4] px-3 py-2.5 sm:py-3 shadow-sm hover:bg-gray-50 transition text-sm sm:text-base"
              >
                <span>{selected}</span>
                <span
                  className={`transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
                >
                  <AngleBottomSvg />
                </span>
              </button>
              <div
                className={`absolute left-0 mt-2 w-full rounded-lg border bg-white shadow-lg transition-all duration-200 z-50 ${
                  open
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                {options.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelected(option);
                      setSelectedSort(option);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 hover:bg-gray-100 transition"
                  >
                    <span className="lg:text-lg text-sm text-left">
                      {option}
                    </span>
                    {selected === option && (
                      <FaCheck className="text-primary-blue text-xs shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div> */}
        </div>

        {/* ── Horizontal Filter Bar (Desktop) — Sticky on scroll ── */}
        <div className="hidden lg:block sticky top-28 z-30 -mx-3 sm:-mx-4 md:-mx-6 mb-6 bg-white/95 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-3 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]">
          <HorizontalFilterBar {...filterProps} />
        </div>

        {/* ── MOBILE: List/Map toggle + Collapsible Filter — Sticky on scroll ── */}
        <div className="block lg:hidden sticky top-20 z-30 -mx-3 sm:-mx-4 md:-mx-6 mb-4 bg-white/95 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-3 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex bg-[#F3F3F4] p-1 rounded-xl mb-3">
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === "list"
                  ? "bg-white text-primary-blue shadow-sm"
                  : "text-gray-500"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === "map"
                  ? "bg-white text-primary-blue shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Map View
            </button>
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between bg-white border border-[#E7E7E7] rounded-xl px-4 py-3 shadow-sm hover:bg-gray-50 transition"
          >
            <span className="text-sm font-medium text-gray-700">Filters & Search</span>
            <span className={`transition-transform shrink-0 ${showMobileFilters ? "rotate-180" : ""}`}>
              <AngleBottomSvg />
            </span>
          </button>
        </div>

        {showMobileFilters && (
          <div className="block lg:hidden -mx-3 sm:-mx-4 md:-mx-6 mb-4 px-3 sm:px-4 md:px-6">
            <FilterPanel {...filterProps} />
          </div>
        )}

        {/* ── Main Content ── */}
        <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">

          {/* ── Property List — order-1 on desktop ── */}
          <div
            ref={listRef}
            className={`w-full xl:flex-1 order-2  ${
              isMobile && viewMode !== "list" ? "hidden" : "block"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {(!data?.data?.items || data?.data?.items?.length === 0) ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-20 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                    No listings found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 max-w-md">
                    Try adjusting your filters or search criteria to find more properties.
                  </p>
                </div>
              ) : (
                displayedProperties?.map((item: any) => (
                <div
                  key={item._id}
                  className="bg-white shadow-lg rounded-2xl sm:rounded-[28px] overflow-hidden group hover:shadow-2xl transition-all duration-500 px-3 sm:px-4 md:px-4.5 pt-3 sm:pt-4 md:pt-4.5 pb-4 sm:pb-5 md:pb-7.5"
                >
                  <div className="relative overflow-hidden">
                    <figure className="h-[200px] sm:h-[240px] md:h-[280px] lg:h-[300px] overflow-hidden rounded-lg relative group/image">
                      <Image
                        src={item.media?.[0]?.url}
                        alt={item.propertyName}
                        width={500}
                        height={300}
                        onClick={() => setSelectedImage(item.media?.[0]?.url)}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 rounded-lg"
                      />
                      <div
                        className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-all duration-300 rounded-lg flex items-center justify-center cursor-pointer"
                        onClick={() => setSelectedImage(item.media?.[0]?.url)}
                      >
                        <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                          <div className="bg-white/95 p-2 sm:p-3 rounded-full">
                            <svg
                              className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
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
                          <span className="text-white font-medium text-xs sm:text-sm">
                            Click to view
                          </span>
                        </div>
                      </div>
                    </figure>
                    <div
                      onClick={() =>
                        !loadingFavorites[item._id] && toggleFavorite(item._id)
                      }
                      className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm p-2 sm:p-2.5 rounded-full cursor-pointer hover:bg-white transition-colors"
                    >
                      {loadingFavorites[item._id] ? (
                        <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : favoriteStates[item._id] ? (
                        <Favourites />
                      ) : (
                        <Favourite />
                      )}
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 md:mt-5">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[28px] font-bold text-[#0085FF]" translate="no">
                      ${item?.price?.toLocaleString()}
                      <span className="text-xs sm:text-sm md:text-base lg:text-[18px] font-medium text-[#919191] pl-1">
                        USD
                      </span>
                    </h3>
                    <h4 className="text-sm sm:text-base lg:text-lg xl:text-[24px] font-medium text-[#5F5F5F] mt-2 sm:mt-3 line-clamp-1" translate="no">
                      {item.propertyName}
                    </h4>
                    <div className="flex items-center gap-1.5 sm:gap-2.5 mt-2 sm:mt-3 md:mt-4">
                      <Location className="w-4 h-4 sm:w-[18px] sm:h-[18px] 2xl:w-[24px] 2xl:h-[24px]" />
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-[18px] font-medium text-[#919191] line-clamp-1" translate="no">
                        {item.city}, {item.state}
                      </p>
                    </div>
                    <div className="flex flex-nowrap items-center gap-3 sm:gap-4 md:gap-5 mt-3 sm:mt-4 md:mt-5 overflow-hidden">
                      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                        <Bed className="shrink-0 scale-90 sm:scale-100" />
                        <span className="text-xs sm:text-sm lg:text-[14px] font-normal text-[#919191] whitespace-nowrap" translate="no">
                          {item.bedrooms} Bed
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                        <Bathtub className="shrink-0 scale-90 sm:scale-100" />
                        <span className="text-xs sm:text-sm lg:text-[14px] font-normal text-[#919191] whitespace-nowrap" translate="no">
                          {item.bathrooms} Bath
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                        <Acceleration className="shrink-0 scale-90 sm:scale-100" />
                        <span className="text-xs sm:text-sm lg:text-[14px] font-normal text-[#919191] whitespace-nowrap" translate="no">
                          {item.areaInSqMeter} m²
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleContact(item._id)}
                      className="mt-4 sm:mt-5 md:mt-8 w-full bg-[#0085FF] text-white font-medium text-sm sm:text-base lg:text-lg py-2.5 sm:py-3 xl:py-4 rounded-xl sm:rounded-2xl hover:bg-transparent hover:text-[#0085FF] border border-[#0085FF] transition-all duration-300 cursor-pointer"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              )))}

              {!showAll && data?.data?.items?.length > 4 && (
                <div className="col-span-full text-center">
                  <button
                    onClick={() => setShowAll(true)}
                    className="bg-[#0085FF] text-white font-medium text-sm sm:text-base lg:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:bg-white hover:text-black border border-blue-600 cursor-pointer"
                  >
                    View All Properties
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Map — order-2 on desktop ── */}
          <div
            ref={mapRef}
            className={`w-full xl:w-[35%] h-[350px] sm:h-[500px] lg:h-[calc(100vh-150px)] xl:h-[calc(100vh-300px)] xl:sticky xl:top-[280px] order-1 relative shrink-0 overflow-hidden ${
              isMobile && viewMode !== "map" ? "hidden" : "block"
            }`}
          >
            <div className="w-full h-full">
              <APIProvider
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
              >
                <MapContent properties={data?.data?.items || []} />
              </APIProvider>
            </div>
          </div>

        </div>
      </div>

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
              className="absolute top-2 right-2 sm:-top-12 sm:right-0 bg-black/60 sm:bg-transparent rounded-full sm:rounded-none text-white hover:text-gray-300 transition-colors p-2 z-10 cursor-pointer"
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

      {/* ── CTA Section ── */}
      <section
        className="relative w-full py-12 sm:py-16 xl:py-24 px-4 sm:px-6 flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co.com/VW8vzVDx/Group-35-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <div className="relative z-10 px-2 sm:px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl 2xl:text-[32px] font-semibold leading-7 sm:leading-8 xl:leading-[48px] text-[#212B36] mb-3 sm:mb-4">
            {cta?.data?.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg 2xl:text-[24px] font-semibold xl:leading-[36px] text-[#454F5B] mb-4 sm:mb-5 xl:mb-10">
            {cta?.data?.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Link href={"/browse"} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-8 cursor-pointer text-sm sm:text-base xl:text-xl py-3 sm:py-2.5 xl:py-[20px] rounded-xl bg-primary-blue text-white font-medium hover:bg-primary-blue transition">
                {cta?.data?.btnTxt?.[0] ?? "Start Selling Today"}
              </button>
            </Link>
            <Link href={"/pricing"} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-8 cursor-pointer text-sm sm:text-base xl:text-xl py-3 sm:py-2.5 xl:py-[20px] rounded-xl border-2 border-primary-blue text-primary-blue font-medium hover:bg-blue-50 transition">
                {cta?.data?.btnTxt?.[1] ?? "View Pricing Plans"}
              </button>
            </Link>
          </div>
          <p className="text-sm sm:text-base text-[#212B36] xl:text-lg">
            No credit card required. Get started in minutes.
          </p>
        </div>
      </section>
    </>
  );
};

// Wrapped in Suspense so useSearchParams can be used during prerendering
const page = () => {
  return (
    <Suspense fallback={<BrowseDetailsSkeleton />}>
      <BuyerBrowseContent />
    </Suspense>
  );
};

export default page;
