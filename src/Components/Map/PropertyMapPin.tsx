"use client";
import React from "react";
import Link from "next/link";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface PropertyMapPinProps {
  item: any;
  href: string;
}

const PropertyMapPin = ({ item, href }: PropertyMapPinProps) => {
  if (!item?.location?.lat || !item?.location?.lng) return null;

  const position = { lat: item.location.lat, lng: item.location.lng };
  const formattedPrice = `$${new Intl.NumberFormat().format(item.price || 0)}`;

  return (
    <AdvancedMarker position={position}>
      <Link href={href} className="outline-none">
        <div
          className="cursor-pointer whitespace-nowrap rounded-full border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-bold text-black shadow-md transition-transform hover:scale-105"
          translate="no"
        >
          {formattedPrice}
        </div>
      </Link>
    </AdvancedMarker>
  );
};

export default PropertyMapPin;
