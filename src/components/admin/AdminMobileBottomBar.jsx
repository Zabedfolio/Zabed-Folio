"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import mainPic from "@/assets/main-pic.jpg";
import {
  HiOutlineChartBar,
  HiOutlineCalendar,
  HiOutlineBriefcase,
  HiOutlineCog,
  HiOutlineLibrary,
  HiOutlineAcademicCap,
  HiOutlineCube,
  HiOutlineExternalLink,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";

const PRIMARY_TABS = [
  { href: "/admin", label: "Overview", icon: HiOutlineChartBar, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: HiOutlineCalendar },
  { href: "/admin/projects", label: "Projects", icon: HiOutlineBriefcase },
  { href: "/admin/skills", label: "Skills", icon: HiOutlineCog },
];

const MORE_NAV_ITEMS = [
  { href: "/admin/case-studies", label: "Case Studies", icon: HiOutlineLibrary },
  { href: "/admin/education", label: "Education", icon: HiOutlineAcademicCap },
  { href: "/admin/experience", label: "Experience", icon: HiOutlineCube },
];

export default function AdminMobileBottomBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isMoreOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMoreOpen]);

  const handleSignOut = async () => {
    localStorage.removeItem("admin_logged_in");
    await signOut({
      callbackURL: "/admin/login",
    });
    router.push("/admin/login");
    router.refresh();
  };

  const isMoreActive = MORE_NAV_ITEMS.some((item) => pathname.startsWith(item.href));

  return (
    <>
      {/* Slide-Up Bottom Drawer for "More" Menu */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={() => setIsMoreOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="relative bg-white rounded-t-3xl border-t border-black/10 shadow-2xl p-5 max-h-[85vh] overflow-y-auto z-10 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-black/8">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-black/10 bg-white p-0.5 shadow-xs shrink-0">
                  <Image
                    src={mainPic}
                    alt="Zabed Mahmud"
                    fill
                    className="object-cover rounded-[8px]"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1a1a1a] leading-tight">
                    More Sections
                  </h3>
                  <p className="text-[10px] font-mono font-semibold text-[#12A36B] uppercase tracking-wider">
                    Admin Navigation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="w-8 h-8 rounded-xl bg-black/4 hover:bg-black/8 text-black/60 flex items-center justify-center transition"
                aria-label="Close menu"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            </div>

            {/* Additional Modules */}
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-black/40 uppercase tracking-wider px-2 py-1">
                Portfolio Sections
              </span>
              {MORE_NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-[#1a1a1a] text-white shadow-sm"
                        : "text-black/70 hover:bg-black/4 border border-transparent"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Actions & Sign Out */}
            <div className="pt-3 border-t border-black/8 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-black/3 hover:bg-black/6 text-black/70 text-xs font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>View Public Site</span>
                </span>
                <HiOutlineExternalLink className="text-sm text-black/40" />
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-bold text-red-600 bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 transition cursor-pointer"
              >
                <HiOutlineLogout className="text-base" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Bar */}
      <nav
        aria-label="Mobile admin navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/8 shadow-lg px-1.5 py-1.5 flex items-center justify-around safe-bottom"
      >
        {PRIMARY_TABS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all ${
                isActive
                  ? "text-[#12A36B] bg-[#12A36B]/10 font-extrabold"
                  : "text-black/50 hover:text-[#1a1a1a]"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-0.5 ${
                  isActive ? "text-[#12A36B] scale-110" : "text-black/40"
                } transition-transform`}
              />
              <span className="truncate max-w-[64px]">{item.label}</span>
            </Link>
          );
        })}

        {/* 5th Tab: Menu / More Button */}
        <button
          type="button"
          onClick={() => setIsMoreOpen((prev) => !prev)}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            isMoreActive || isMoreOpen
              ? "text-[#12A36B] bg-[#12A36B]/10 font-extrabold"
              : "text-black/50 hover:text-[#1a1a1a]"
          }`}
          aria-label="More admin modules"
          aria-expanded={isMoreOpen}
        >
          <HiOutlineMenu
            className={`w-5 h-5 mb-0.5 ${
              isMoreActive || isMoreOpen ? "text-[#12A36B] scale-110" : "text-black/40"
            } transition-transform`}
          />
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
}
