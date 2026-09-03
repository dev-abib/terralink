"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

// ─── Pin icons (white, stroke-based) ─────────────────────────────────────────
const BedIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" />
    <path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
    <path d="M3 21h18" />
    <path d="M7 15h2M15 15h2" />
  </svg>
);

const TreeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.03a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z" />
    <path d="M12 19v3" />
  </svg>
);

const BuildingIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
    <path d="M2 22h20" />
    <path d="M10 6h4M10 10h4M10 14h4" />
  </svg>
);

// ─── Pin styles by property type (matches the Google Maps category-pin look) ──
const PIN_STYLES: Record<string, { color: string; icon?: React.ReactNode }> = {
  house: { color: "#F06292", icon: <BedIcon /> },
  land: { color: "#4CAF50", icon: <TreeIcon /> },
  commercial: { color: "#9C27B0", icon: <BuildingIcon /> },
  default: { color: "#757575", icon: undefined },
};

const getPinStyle = (propertyType?: string) => {
  const type = (propertyType || "").toLowerCase();
  if (type.includes("house") || type.includes("home"))
    return PIN_STYLES.house;
  if (type.includes("land") || type.includes("plot")) return PIN_STYLES.land;
  if (
    type.includes("commercial") ||
    type.includes("shop") ||
    type.includes("office")
  )
    return PIN_STYLES.commercial;
  return PIN_STYLES.default;
};

// ─── Teardrop pin with a white icon ──────────────────────────────────────────
const TeardropPin = ({ color, icon }: { color: string; icon: React.ReactNode }) => (
  <div className="relative shrink-0" style={{ width: 28, height: 38 }}>
    <svg
      width="28"
      height="38"
      viewBox="0 0 28 38"
      className="absolute inset-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
    >
      <path
        d="M14 0C6.27 0 0 6.27 0 14c0 11 14 24 14 24s14-13 14-24C28 6.27 21.73 0 14 0Z"
        fill={color}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
      />
    </svg>
    <div
      className="absolute inset-x-0 top-[7px] flex justify-center"
      style={{ color: "#ffffff" }}
    >
      {icon}
    </div>
  </div>
);

// ─── Grey circular pin with a white centre (fallback style) ─────────────────
const CirclePin = ({ color }: { color: string }) => (
  <div
    className="relative shrink-0 rounded-full bg-white"
    style={{
      width: 22,
      height: 22,
      border: `6px solid ${color}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    }}
  />
);

// ─── Price pill tooltip (white pill with black text) ────────────────────────
const PricePill = ({ price }: { price: string }) => (
  <div className="pointer-events-none absolute -top-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center whitespace-nowrap">
    <div
      className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-bold text-black shadow-md"
      translate="no"
    >
      {price}
    </div>
    <div className="-mt-[3px] h-2 w-2 rotate-45 border-b border-r border-gray-200 bg-white" />
  </div>
);

interface PropertyMapPinProps {
  item: any;
  href: string;
}

const PropertyMapPin = ({ item, href }: PropertyMapPinProps) => {
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!item?.location?.lat || !item?.location?.lng) return null;

  const position = { lat: item.location.lat, lng: item.location.lng };
  const style = getPinStyle(item.propertyType);
  const formattedPrice = `$${new Intl.NumberFormat().format(item.price || 0)}`;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHovered(false), 200);
  };

  return (
    <AdvancedMarker position={position} zIndex={hovered ? 5 : 1}>
      <Link
        href={href}
        className="outline-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative cursor-pointer">
          {hovered && <PricePill price={formattedPrice} />}

          {style.icon ? (
            <TeardropPin color={style.color} icon={style.icon} />
          ) : (
            <CirclePin color={style.color} />
          )}

          {/* Property name label beside the pin (coloured like the pin) */}
          <span
            className="absolute left-full top-1/2 ml-1.5 max-w-[150px] -translate-y-1/2 truncate whitespace-nowrap text-xs font-semibold leading-none"
            style={{
              color: style.color,
              textShadow:
                "0 0 2px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 1px 2px rgba(255,255,255,0.95)",
            }}
            translate="no"
          >
            {item.propertyName}
          </span>
        </div>
      </Link>
    </AdvancedMarker>
  );
};

export default PropertyMapPin;