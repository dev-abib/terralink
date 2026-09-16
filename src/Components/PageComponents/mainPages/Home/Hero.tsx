"use client";
import { CiSearch } from "react-icons/ci";
import Container from "@/Components/Common/Container";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Location, Lookingfor } from "@/Components/Svg/SvgContainer";

type TabType = "buy" | "rent";

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

const defaultPropertyTypes = ["House", "Apartment", "Land", "Commercial"];

interface SearchFormData {
  lookingFor: string;
  location: string;
}
interface heroProps {
  hero?: any;
}

const Hero: React.FC<heroProps> = ({ hero }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<TabType>("buy");
  const [formData, setFormData] = useState<SearchFormData>({
    lookingFor: "",
    location: "",
  });

  const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Redirect to the browse page with the selected filters as query params.
    const params = new URLSearchParams();
    params.set("type", activeTab);
    if (
      formData.lookingFor &&
      formData.lookingFor !== "All" &&
      formData.lookingFor !== "All Types" &&
      formData.lookingFor !== "Select Property Type"
    ) {
      params.set("propertyType", formData.lookingFor);
    }
    if (
      formData.location &&
      formData.location !== "Select a Location"
    ) {
      params.set("location", formData.location);
    }

    const isBuyer = pathname?.startsWith("/buyerlayout");
    const browsePath = isBuyer ? "/buyerlayout/browse" : "/browse";
    router.push(`${browsePath}?${params.toString()}`);
  };

  const propertyTypesList: string[] =
    Array.isArray(hero?.propertyType) && hero.propertyType.length > 0
      ? hero.propertyType
      : typeof hero?.propertyType === "string" && hero.propertyType.trim()
      ? [hero.propertyType.trim()]
      : defaultPropertyTypes;

  return (
    <section
      style={{
        backgroundImage: hero?.bgImg
          ? `url(${hero.bgImg})`
          : "url('/Assets/mainhero.png')",
      }}
      className="mainhero pt-10 pb-16 sm:pt-14 sm:pb-24 md:pt-16 md:pb-32 lg:pt-21 lg:pb-[280px] bg-cover bg-center xl:px-5 px-0"
    >
      <Container>
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 sm:gap-10 lg:gap-20">
          {/* Left Content */}
          <div className="max-w-full lg:max-w-[880px] text-center lg:text-left px-4 sm:px-0">
            <h1 className="text-white text-[22px] sm:text-3xl lg:text-4xl xl:text-[55px] font-bold leading-snug sm:leading-tight xl:leading-[84px]">
              {hero?.title}
            </h1>
            <p className="text-[#F9FAFB] font-medium text-sm sm:text-base lg:text-[20px] pt-3 sm:pt-5 lg:pt-6 mx-auto lg:mx-0 max-w-xl sm:max-w-none">
              {hero?.description}
            </p>
          </div>

          {/* Search Card */}
          <div className="w-full lg:w-auto flex-shrink-0 px-4 sm:px-0">
            <div className="bg-white rounded-2xl lg:rounded-[28px] p-5 sm:p-6 md:p-8 lg:p-7.5 shadow-2xl">
              <h3 className="text-[#212B36] font-medium text-lg sm:text-xl lg:text-[20px] mb-4 lg:mb-6 text-center lg:text-left">
                Find the Place That Fits You
              </h3>

              {/* Tabs */}
              <div className="bg-[#E6F3FF] p-1 rounded-2xl lg:rounded-[40px] flex gap-x-2 lg:gap-x-3 mb-4 sm:mb-6 lg:mb-7">
                <button
                  type="button"
                  onClick={() => setActiveTab("buy")}
                  className={`rounded-2xl lg:rounded-[40px] py-3 px-6 lg:py-1 lg:px-0 w-full text-center font-medium transition-all duration-200 cursor-pointer text-sm sm:text-base
                    ${
                      activeTab === "buy"
                        ? "bg-[#0085FF] text-white shadow-md"
                        : "bg-transparent text-[#212B36] hover:bg-blue-50"
                    }
                  `}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("rent")}
                  className={`rounded-2xl lg:rounded-[40px] py-3 px-6 lg:py-1 lg:px-0 w-full text-center font-medium transition-all duration-200 cursor-pointer text-sm sm:text-base
                    ${
                      activeTab === "rent"
                        ? "bg-[#0085FF] text-white shadow-md"
                        : "bg-transparent text-[#212B36] hover:bg-blue-50"
                    }
                  `}
                >
                  Rent
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Looking For */}
                <div className="relative mb-5 lg:mb-0">
                  <h4 className="text-[#454F5B] font-normal text-sm sm:text-base lg:text-[18px] mb-1.5 sm:mb-2">
                    Looking For
                  </h4>
                  <select
                    name="lookingFor"
                    value={formData.lookingFor}
                    onChange={handleChange}
                    className="border border-[#DAE6E9] rounded-xl sm:rounded-2xl lg:rounded-[18px] pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 w-full appearance-none bg-white focus:outline-none focus:border-[#0085FF] text-sm sm:text-base cursor-pointer"
                  >
                    <option value="">Select Property Type</option>
                    {propertyTypesList.map((item: any) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <div className="absolute top-[34px] sm:top-11 lg:top-12 left-3 sm:left-4 pointer-events-none scale-90 sm:scale-100">
                    <Lookingfor />
                  </div>
                </div>

                {/* Location */}
                <div className="relative mt-5 lg:mt-2.5">
                  <h4 className="text-[#454F5B] font-normal text-sm sm:text-base lg:text-[18px] mb-1.5 sm:mb-2">
                    Location
                  </h4>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="border border-[#DAE6E9] rounded-xl sm:rounded-2xl lg:rounded-[18px] pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 w-full appearance-none bg-white focus:outline-none focus:border-[#0085FF] text-sm sm:text-base cursor-pointer"
                  >
                    <option value="">Select a Location</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <div className="absolute top-[34px] sm:top-11 lg:top-12 left-3 sm:left-4 pointer-events-none scale-90 sm:scale-100">
                    <Location />
                  </div>
                </div>

                {/* Search Button */}
                <div className="mt-5 sm:mt-6 lg:mt-8 relative group">
                  <button
                    type="submit"
                    className="bg-[#0085FF] rounded-xl sm:rounded-2xl lg:rounded-[18px] px-8 xl:py-4 py-3.5 sm:py-3 text-center text-white font-medium text-sm sm:text-base w-full border border-[#0085FF] hover:bg-transparent hover:text-[#0085FF] transition-all duration-300 group cursor-pointer"
                  >
                    Search Properties
                  </button>
                  <CiSearch className="absolute xl:top-4 top-3.5 sm:top-3 left-6 sm:left-8 text-white group-hover:text-[#0085FF] size-5 sm:size-6 transition-colors duration-300" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
