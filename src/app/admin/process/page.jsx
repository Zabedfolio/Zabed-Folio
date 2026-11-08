"use client";

import Link from "next/link";
import { HiOutlineSparkles, HiOutlineArrowLeft } from "react-icons/hi";
import AdminProcessManager from "@/components/admin/AdminProcessManager";

export default function AdminProcessPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1a1a1a]">
              Work Process Steps
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#12A36B]/10 px-2.5 py-0.5 text-xs font-mono font-bold text-[#12A36B]">
              <HiOutlineSparkles className="text-sm" />
              Home Page
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-medium text-black/50">
            Customize the step-by-step roadmap from Discovery Meeting to Production Launch
          </p>
        </div>

        <Link
          href="/admin/showcase"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-black/10 bg-white hover:bg-black/5 text-xs font-bold text-black/70 transition"
        >
          <HiOutlineArrowLeft className="text-sm" />
          <span>Showcase Projects</span>
        </Link>
      </div>

      <AdminProcessManager />
    </div>
  );
}
