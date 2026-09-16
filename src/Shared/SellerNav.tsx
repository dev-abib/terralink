"use client";
import Link from "next/link";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { GoListUnordered } from "react-icons/go";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdLogout, MdEdit, MdSettings, MdOutlineMessage } from "react-icons/md";
import Container from "@/Components/Common/Container";
import { useGetUserData } from "@/Hooks/api/auth_api";
import { useGetConversations } from "@/Hooks/api/message.api";
import { PlanetSvg } from "@/Components/Svg/SvgContainer";
import { AngleBottomSvg } from "@/Components/Svg/SvgContainer2";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

const STORAGE_KEY = "preferred_language";

const SellerNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const languages = ["English", "Spanish"];
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("Spanish");

  // Automatically close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsOpen(false);
    setLangOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Restore saved language preference on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en") {
      setActiveLang("English");
    }
  }, []);

  const token = localStorage.getItem("token");
  const { data } = useGetUserData(token);
  const { data: msgData } = useGetConversations(token ?? undefined);
  const unreadCount = msgData?.data?.totalUnreadCount ?? 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-dropdown-container")) {
        setProfileOpen(false);
      }
      if (!target.closest(".lang-dropdown-container")) {
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lang: "en" | "es") => {
    const tryChange = (attempts = 0) => {
      const select = document.querySelector(
        ".goog-te-combo",
      ) as HTMLSelectElement | null;

      if (!select) {
        if (attempts < 5) setTimeout(() => tryChange(attempts + 1), 200);
        return;
      }

      select.value = lang;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      select.dispatchEvent(new Event("input", { bubbles: true }));

      setTimeout(() => {
        if (select.value !== lang && attempts < 5) {
          tryChange(attempts + 1);
        }
      }, 300);
    };

    tryChange();
  };

  const handleLangSelect = (lang: string, closeDrawer = false) => {
    setActiveLang(lang);
    setLangOpen(false);
    const langCode = lang === "Spanish" ? "es" : "en";
    localStorage.setItem(STORAGE_KEY, langCode);
    changeLanguage(langCode);
    if (closeDrawer) setIsOpen(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.dismiss();
      // Use hard redirect to avoid React/Google Translate DOM conflicts
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 100);
      setProfileOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const profileMenuItems = [
    {
      label: "View Profile",
      icon: CgProfile,
      href: "/seller/profile",
      action: null,
    },
    {
      label: "Settings",
      icon: MdSettings,
      href: "/seller/settings",
      action: null,
    },
    {
      label: "Logout",
      icon: MdLogout,
      href: null,
      action: handleLogout,
      className: "text-red-500 hover:bg-red-50",
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out xl:px-5 px-0 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <Container>
        <header className="w-full text-black">
          <div className="flex items-center justify-between py-[26px]">
            <Link href="/seller" className="flex items-center">
              <Image
                src="https://i.ibb.co.com/2YMddrBt/Group-1321314777.png"
                alt="Terralink Logo"
                width={220}
                height={60}
                priority
                className="w-[150px] 2xl:w-[220px]"
              />
            </Link>

            <ul className="hidden xl:flex items-center gap-2 2xl:gap-5 menu_item">
              <li>
                <Link
                  href="/seller/forseller"
                  className="hover:text-black transition"
                >
                  For Sellers
                </Link>
              </li>
              <li>
                <Link
                  href="/seller/browse"
                  className="hover:text-black transition"
                >
                  Browse Properties
                </Link>
              </li>
              <Link href={"/seller/pricing"}>
                <li className="flex items-center gap-1 cursor-pointer hover:text-black transition">
                  Subscription Plans
                </li>
              </Link>
              <li>
                <Link
                  href="/seller/about"
                  className="hover:text-black transition"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/seller/contact-us"
                  className="hover:text-black transition"
                >
                  Contact Us
                </Link>
              </li>

              <li className="relative lang-dropdown-container">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:text-black transition notranslate"
                  translate="no"
                >
                  <PlanetSvg />
                  <span translate="no" className="notranslate">
                    {activeLang}
                  </span>
                  <span
                    className={`text-xs ml-3 transition-transform ${langOpen ? "rotate-180" : ""}`}
                  >
                    <AngleBottomSvg />
                  </span>
                </button>

                <div
                  className={`absolute top-full right-0 mt-3 w-[160px] rounded-xl bg-white shadow-lg border border-text-dark transition-all duration-200 ${
                    langOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  {languages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLangSelect(lang)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-xl transition notranslate"
                      translate="no"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </li>
            </ul>

            <div className="hidden xl:flex items-center gap-4">
              <Link
                href="/seller/message"
                className="rounded-xl border-2 border-primary-blue px-3 py-2 2xl:py-3 2xl:text-lg leading-[30px] text-primary-blue hover:bg-primary-blue hover:text-white transition flex gap-x-2 items-center relative"
              >
                <MdOutlineMessage className="size-7" />

                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] font-bold min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full shadow-md">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
              <Link
                href="/seller/my-listing"
                className="rounded-xl border-2 border-primary-blue px-3 py-2 2xl:py-3 2xl:text-lg leading-[30px] text-primary-blue hover:bg-primary-blue hover:text-white transition flex gap-x-2 items-center"
              >
                <GoListUnordered className="size-5" />
                My Listings
              </Link>

              {/* Profile Dropdown */}
              <div className="relative profile-dropdown-container">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="rounded-xl bg-primary-blue px-[18px] py-1.5 2xl:py-3 2xl:text-xl leading-[30px] text-white hover:opacity-90 border-2 border-primary-blue transition flex gap-x-2 items-center cursor-pointer"
                >
                  {data?.data?.profilePicture ? (
                    <Image
                      src={data?.data?.profilePicture}
                      alt="Profile"
                      width={300}
                      height={300}
                      className="rounded-full object-cover h-8 w-8"
                    />
                  ) : (
                    <CgProfile className="size-7" />
                  )}
                  <span>Profile</span>
                  <span
                    className={`text-xs transition-transform ml-1 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  >
                    <AngleBottomSvg />
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                <div
                  className={`absolute top-full right-0 mt-3 w-[200px] rounded-xl bg-white shadow-lg border border-gray-200 transition-all duration-200 overflow-hidden z-50 ${
                    profileOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800">
                      {data?.data?.firstName} {data?.data?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {data?.data?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {profileMenuItems.map((item, index) => (
                      <div key={item.label}>
                        {item.action ? (
                          <button
                            onClick={item.action}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition text-left text-sm ${
                              item.className || "text-gray-700"
                            }`}
                          >
                            <item.icon className="size-4" />
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            href={item.href || "#"}
                            onClick={() => setProfileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition text-left text-sm ${
                              item.className || "text-gray-700"
                            }`}
                          >
                            <item.icon className="size-4" />
                            {item.label}
                          </Link>
                        )}
                        {index === profileMenuItems.length - 2 && (
                          <div className="my-2 border-t border-gray-200" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="xl:hidden text-2xl cursor-pointer"
            >
              <FaBars />
            </button>
          </div>

          {/* Mobile Overlay with smooth fade & blur */}
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden transition-all duration-300 ease-in-out ${
              isOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsOpen(false)}
            aria-hidden={!isOpen}
          />

          {/* Mobile Menu Drawer with smooth slide */}
          <div
            className={`fixed top-0 left-0 z-50 h-full w-[280px] max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } xl:hidden overflow-y-auto`}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <Image
                src="https://i.ibb.co.com/2YMddrBt/Group-1321314777.png"
                alt="Terralink Logo"
                width={150}
                height={38}
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 active:scale-90 transition-all text-gray-600 hover:text-black cursor-pointer"
                aria-label="Close menu"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            <ul className="flex flex-col gap-3 px-6 py-5">
              <li>
                <Link href="/seller/forseller" onClick={() => setIsOpen(false)}>
                  For Sellers
                </Link>
              </li>
              <li>
                <Link href="/seller/browse" onClick={() => setIsOpen(false)}>
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/seller/pricing"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link href="/seller/about" onClick={() => setIsOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/seller/contact-us"
                  onClick={() => setIsOpen(false)}
                >
                  Contact Us
                </Link>
              </li>

              {/* Mobile Language Selector */}
              <li className="relative lang-dropdown-container">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:text-black transition notranslate"
                  translate="no"
                >
                  <PlanetSvg />
                  <span translate="no" className="notranslate">
                    {activeLang}
                  </span>
                  <span
                    className={`text-xs ml-3 transition-transform ${langOpen ? "rotate-180" : ""}`}
                  >
                    <AngleBottomSvg />
                  </span>
                </button>

                <div
                  className={`absolute top-full right-0 mt-3 w-[160px] rounded-xl bg-white shadow-lg border border-text-dark transition-all duration-200 ${
                    langOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  {languages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLangSelect(lang, true)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition notranslate"
                      translate="no"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </li>
            </ul>

            <div className="px-6 flex flex-col gap-4 py-4 border-t">
              <Link
                href="/seller/my-listing"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border-2 border-primary-blue px-[24px] py-3 text-center text-primary-blue flex gap-x-2 items-center"
              >
                <GoListUnordered className="size-7" />
                My Listings
              </Link>
              <Link
                href="/seller/message"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border-2 border-primary-blue px-[24px] py-3 text-center text-primary-blue flex gap-x-2 items-center relative"
              >
                <MdOutlineMessage className="size-7" />
                Messages
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[11px] font-bold min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full shadow-md ml-2">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Mobile Profile Menu */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="rounded-xl bg-primary-blue px-[18px] py-3 text-white flex gap-x-2 items-center justify-between w-full"
                >
                  <div className="flex gap-x-2 items-center">
                    {data?.data?.profilePicture ? (
                      <Image
                        src={data?.data?.profilePicture}
                        alt="Profile"
                        width={300}
                        height={300}
                        className="rounded-full object-cover h-8 w-8"
                      />
                    ) : (
                      <CgProfile className="size-7" />
                    )}
                    <span>Profile</span>
                  </div>
                  <span
                    className={`text-xs transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  >
                    <AngleBottomSvg />
                  </span>
                </button>

                {/* Mobile Profile Dropdown */}
                {profileOpen && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b bg-gray-50">
                      <p className="text-sm font-semibold text-gray-800">
                        {data?.data?.firstName} {data?.data?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {data?.data?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {profileMenuItems.map((item, index) => (
                        <div key={item.label}>
                          {item.action ? (
                            <button
                              onClick={() => {
                                item.action();
                                setIsOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition text-left text-sm ${
                                item.className || "text-gray-700"
                              }`}
                            >
                              <item.icon className="size-4" />
                              {item.label}
                            </button>
                          ) : (
                            <Link
                              href={item.href || "#"}
                              onClick={() => {
                                setProfileOpen(false);
                                setIsOpen(false);
                              }}
                              className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition text-left text-sm ${
                                item.className || "text-gray-700"
                              }`}
                            >
                              <item.icon className="size-4" />
                              {item.label}
                            </Link>
                          )}
                          {index === profileMenuItems.length - 2 && (
                            <div className="my-2 border-t border-gray-200" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 xl:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}
        </header>
      </Container>
    </nav>
  );
};

export default SellerNav;
