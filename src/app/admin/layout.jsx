"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineCollection,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineExternalLink,
  HiOutlineCog,
  HiOutlineDocumentText,
  HiOutlineLibrary,
} from "react-icons/hi";

const sidebarItems = [
  { href: "/admin", label: "Overview", icon: HiOutlineChartBar },
  { href: "/admin/projects", label: "Projects", icon: HiOutlineBriefcase },
  { href: "/admin/skills", label: "Skills", icon: HiOutlineCog },
  { href: "/admin/case-studies", label: "Case Studies", icon: HiOutlineLibrary },
  { href: "/admin/education", label: "Education", icon: HiOutlineAcademicCap },
  { href: "/admin/experience", label: "Experience", icon: HiOutlineCube },
  { href: "/admin/process", label: "Process Steps", icon: HiOutlineCube },
  { href: "/admin/notes", label: "Notes", icon: HiOutlineCollection },
  { href: "/admin/resume", label: "Resume", icon: HiOutlineDocumentText },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If login page, don't wrap with sidebar/layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("admin_sidebar_collapsed", String(nextState));
  };

  const handleSignOut = async () => {
    localStorage.removeItem("admin_logged_in");
    await signOut({
      callbackURL: "/admin/login",
    });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] flex">
      {/* Sidebar for Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-[#070606] border-r border-white/5 h-screen sticky top-0 flex-shrink-0 transition-all duration-300 z-30 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2.5 group overflow-hidden">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-white/10 bg-white/5 p-1 transition-all duration-300 group-hover:scale-105 group-hover:border-[#ff4d00]/30 shadow-sm flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Zabed Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            {!isCollapsed && (
              <div className="leading-tight animate-fadeIn">
                <div className="text-[11px] font-mono tracking-[0.25em] text-white">ZABED</div>
                <div className="text-[9px] font-mono tracking-[0.2em] text-[#ff4d00] font-bold">ADMIN</div>
              </div>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-[#ff4d00]/30 transition"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <span className="text-xs font-bold font-mono text-[#ff4d00] px-0.5">»</span>
            ) : (
              <span className="text-xs font-bold font-mono text-white/50 px-0.5">«</span>
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-xl text-sm font-medium transition duration-200 ${
                  isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
                } ${
                  isActive
                    ? "bg-[#ff4d00]/10 border border-[#ff4d00]/20 text-[#ff4d00]"
                    : "text-white/55 hover:text-white hover:bg-white/[0.02] border border-transparent"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon className="text-lg flex-shrink-0" />
                {!isCollapsed && <span className="animate-fadeIn">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-2">
          <Link
            href="/"
            target="_blank"
            className={`flex items-center w-full text-white/55 hover:text-white rounded-xl hover:bg-white/[0.02] transition ${
              isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3 text-xs"
            }`}
            title={isCollapsed ? "View Portfolio" : ""}
          >
            <span className="flex items-center gap-2">
              <HiOutlineExternalLink className="text-sm" /> 
              {!isCollapsed && <span className="animate-fadeIn">View Portfolio</span>}
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className={`flex items-center w-full text-white/55 hover:text-red-400 hover:bg-red-500/5 rounded-xl border border-transparent hover:border-red-500/10 transition duration-200 ${
              isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3 text-sm font-medium"
            }`}
            title={isCollapsed ? "Sign Out" : ""}
          >
            <HiOutlineLogout className="text-lg flex-shrink-0" />
            {!isCollapsed && <span className="animate-fadeIn">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-16 flex items-center justify-between px-6 bg-[#0a0808]/80 border-b border-white/5 backdrop-blur-xl sticky top-0 z-40">
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="relative h-7 w-7 overflow-hidden rounded-lg border border-white/10 bg-white/5 p-0.5 shadow-sm">
              <Image
                src="/logo.png"
                alt="Zabed Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xs font-mono tracking-[0.25em] text-white font-bold group-hover:text-[#ff4d00] transition">
              ZABED <span className="text-[#ff4d00]">ADMIN</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/[0.05] rounded-lg transition"
          >
            {mobileOpen ? <HiOutlineX className="text-xl" /> : <HiOutlineMenu className="text-xl" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-[#050505]/98 backdrop-blur-2xl flex flex-col pt-20 px-6 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl text-base font-semibold transition ${
                      isActive
                        ? "bg-[#ff4d00]/10 text-[#ff4d00] border border-[#ff4d00]/20"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="py-6 border-t border-white/5 space-y-3">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 px-5 py-4 text-base font-semibold text-white/60"
              >
                <HiOutlineExternalLink className="text-xl" /> View Portfolio
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-4 w-full px-5 py-4 text-base font-semibold text-red-400 bg-red-500/5 rounded-xl border border-red-500/10"
              >
                <HiOutlineLogout className="text-xl" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content Container */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
