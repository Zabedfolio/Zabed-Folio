"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineCog,
  HiOutlineCube,
  HiOutlineLibrary,
  HiOutlineDatabase,
  HiOutlineChevronRight,
  HiOutlineCalendar,
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineExternalLink,
  HiOutlineUserGroup,
  HiOutlineEye,
  HiOutlineDeviceMobile,
  HiOutlineGlobe,
} from "react-icons/hi";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    bookings: 0,
    showcase: 0,
    projects: 0,
    skills: 0,
    caseStudies: 0,
    education: 0,
    experience: 0,
  });
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalVisitors: 0,
    todayViews: 0,
    todayVisitors: 0,
    topPages: [],
    topReferrers: [],
    devices: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [proj, skl, cs, edu, exp, book, show, ana] = await Promise.all([
          fetch("/api/admin/projects").then((r) => r.json()).catch(() => []),
          fetch("/api/admin/skills").then((r) => r.json()).catch(() => []),
          fetch("/api/admin/case-studies").then((r) => r.json()).catch(() => []),
          fetch("/api/admin/education").then((r) => r.json()).catch(() => []),
          fetch("/api/admin/experience").then((r) => r.json()).catch(() => []),
          fetch("/api/admin/bookings/stats").then((r) => r.json()).catch(() => ({ upcoming: 0, total: 0 })),
          fetch("/api/admin/showcase").then((r) => r.json()).catch(() => []),
          fetch("/api/admin/analytics").then((r) => r.json()).catch(() => null),
        ]);

        setStats({
          bookings: book?.upcoming ?? (book?.total ?? 0),
          showcase: Array.isArray(show) ? show.length : 0,
          projects: Array.isArray(proj) ? proj.length : 0,
          skills: Array.isArray(skl) ? skl.length : 0,
          caseStudies: Array.isArray(cs) ? cs.length : 0,
          education: Array.isArray(edu) ? edu.length : 0,
          experience: Array.isArray(exp) ? exp.length : 0,
        });

        if (ana) {
          setAnalytics(ana);
        }
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const cards = [
    {
      title: "Cal.com Bookings",
      count: stats.bookings,
      desc: "Upcoming client discovery calls & sync",
      icon: HiOutlineCalendar,
      color: "bg-[#12A36B]/5",
      href: "/admin/bookings",
    },
    {
      title: "Production Showcase",
      count: stats.showcase,
      desc: "Home page flat logo tabs & metrics",
      icon: HiOutlineSparkles,
      color: "bg-emerald-500/5",
      href: "/admin/showcase",
    },
    {
      title: "Projects Showcase",
      count: stats.projects,
      desc: "Work case studies, details & tech tags",
      icon: HiOutlineBriefcase,
      color: "bg-blue-500/5",
      href: "/admin/projects",
    },
    {
      title: "Skills Directory",
      count: stats.skills,
      desc: "Icons, categories and color schemes",
      icon: HiOutlineCog,
      color: "bg-purple-500/5",
      href: "/admin/skills",
    },
    {
      title: "Case Studies",
      count: stats.caseStudies,
      desc: "Deep-dive project analysis & problems",
      icon: HiOutlineLibrary,
      color: "bg-amber-500/5",
      href: "/admin/case-studies",
    },
    {
      title: "Timeline: Education",
      count: stats.education,
      desc: "Institutions, certificates & duration",
      icon: HiOutlineAcademicCap,
      color: "bg-emerald-500/5",
      href: "/admin/education",
    },
    {
      title: "Timeline: Experience",
      count: stats.experience,
      desc: "Freelance & formal employment roles",
      icon: HiOutlineCube,
      color: "bg-purple-500/5",
      href: "/admin/experience",
    },
  ];

  // Helper for Top Referrer name
  const topReferrerName = analytics.topReferrers?.[0]?.name || "Direct";
  // Helper for Device breakdown
  const mobileCount = analytics.devices?.find((d) => d.name === "Mobile")?.count || 0;
  const desktopCount = analytics.devices?.find((d) => d.name === "Desktop")?.count || 0;
  const totalDev = mobileCount + desktopCount;
  const mobilePct = totalDev > 0 ? Math.round((mobileCount / totalDev) * 100) : 50;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">Dashboard Overview</h1>
        <p className="mt-1 text-sm font-medium text-black/50">
          Live visitor metrics and dynamic portfolio content management
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-3xl bg-white border border-black/8 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-44 rounded-3xl bg-white border border-black/8 animate-pulse shadow-sm" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* ── Native Visitor Analytics Bento ── */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12A36B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#12A36B]"></span>
                </span>
                <h2 className="text-lg font-extrabold text-[#1a1a1a] tracking-tight">
                  Live Portfolio Analytics
                </h2>
                <span className="text-xs font-mono text-black/40 bg-black/4 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>

              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-black/10 bg-white hover:bg-black/5 text-xs font-bold text-black/70 transition shadow-xs self-start sm:self-auto"
              >
                <span>Open Vercel Analytics</span>
                <HiOutlineExternalLink className="text-sm" />
              </a>
            </div>

            {/* 4 Analytics Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Pageviews */}
              <div className="p-5 rounded-3xl bg-white border border-black/8 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-black/50">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Pageviews</span>
                  <span className="p-2 rounded-xl bg-emerald-50 text-[#12A36B]">
                    <HiOutlineEye className="text-lg" />
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">
                    {analytics.totalViews}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-[#12A36B] bg-[#12A36B]/10 px-2 py-0.5 rounded-md">
                    +{analytics.todayViews} today
                  </span>
                </div>
                <p className="text-[11px] text-black/40 font-mono">All-time public interactions</p>
              </div>

              {/* Card 2: Unique Visitors */}
              <div className="p-5 rounded-3xl bg-white border border-black/8 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-black/50">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Unique Visitors</span>
                  <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <HiOutlineUserGroup className="text-lg" />
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">
                    {analytics.totalVisitors}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    +{analytics.todayVisitors} today
                  </span>
                </div>
                <p className="text-[11px] text-black/40 font-mono">Distinct browser sessions</p>
              </div>

              {/* Card 3: Top Referral Channel */}
              <div className="p-5 rounded-3xl bg-white border border-black/8 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-black/50">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Top Referrer</span>
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <HiOutlineGlobe className="text-lg" />
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-[#1a1a1a] tracking-tight truncate">
                  {topReferrerName}
                </div>
                <p className="text-[11px] text-black/40 font-mono">
                  {analytics.topReferrers?.[0]?.count || 0} visits via this channel
                </p>
              </div>

              {/* Card 4: Device Split */}
              <div className="p-5 rounded-3xl bg-white border border-black/8 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-black/50">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Device Split</span>
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <HiOutlineDeviceMobile className="text-lg" />
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-[#1a1a1a] tracking-tight">
                  {mobilePct}% <span className="text-sm font-normal text-black/50">Mobile</span>
                </div>
                <div className="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#12A36B] h-1.5 rounded-full"
                    style={{ width: `${mobilePct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Breakdown Lists: Top Pages & Referrers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Pages */}
              <div className="p-5 rounded-3xl bg-white border border-black/8 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black/70">
                    Top Visited Pages
                  </h3>
                  <span className="text-[10px] font-mono text-black/40">Hits</span>
                </div>
                {analytics.topPages?.length === 0 ? (
                  <p className="text-xs text-black/40 py-4 text-center">
                    No pageview data recorded yet. Browse the site to see hits!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {analytics.topPages.map((page, idx) => {
                      const max = analytics.topPages[0]?.count || 1;
                      const pct = Math.round((page.count / max) * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-[#1a1a1a] font-semibold truncate max-w-[200px]">
                              {page.path === "/" ? "/ (Home)" : page.path}
                            </span>
                            <span className="text-black/60 font-bold">{page.count}</span>
                          </div>
                          <div className="w-full bg-black/4 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#12A36B] h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Top Referrers */}
              <div className="p-5 rounded-3xl bg-white border border-black/8 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black/70">
                    Traffic Sources
                  </h3>
                  <span className="text-[10px] font-mono text-black/40">Referrals</span>
                </div>
                {analytics.topReferrers?.length === 0 ? (
                  <p className="text-xs text-black/40 py-4 text-center">
                    No referral data recorded yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {analytics.topReferrers.map((ref, idx) => {
                      const max = analytics.topReferrers[0]?.count || 1;
                      const pct = Math.round((ref.count / max) * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-[#1a1a1a] font-semibold truncate max-w-[200px]">
                              {ref.name}
                            </span>
                            <span className="text-black/60 font-bold">{ref.count}</span>
                          </div>
                          <div className="w-full bg-black/4 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#3B82F6] h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Content Management Section ── */}
          <div className="space-y-4 pt-4 border-t border-black/8">
            <h2 className="text-lg font-extrabold text-[#1a1a1a] tracking-tight">
              Content & Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={idx}
                    href={card.href}
                    className={`group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-black/8 ${card.color} hover:border-[#1FB57A]/40 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-base text-[#1a1a1a] group-hover:text-[#12A36B] transition">
                          {card.title}
                        </h3>
                        <p className="mt-1 text-xs text-black/50 font-normal">{card.desc}</p>
                      </div>
                      <span className="p-3 rounded-2xl bg-black/4 border border-black/5 text-black/60 group-hover:text-[#12A36B] group-hover:bg-[#1FB57A]/10 transition duration-300">
                        <Icon className="text-xl" />
                      </span>
                    </div>

                    <div className="mt-8 flex items-baseline justify-between">
                      <span className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">
                        {card.count}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-black/40 group-hover:text-[#12A36B] transition duration-300 font-mono font-semibold uppercase tracking-wider">
                        Manage <HiOutlineChevronRight />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Database Integrity */}
          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                <HiOutlineDatabase className="text-2xl" />
              </span>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Database Integrity</h4>
                <p className="text-xs text-black/50 mt-0.5 font-normal">Connected to MongoDB Atlas Cluster0</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Active
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-black/4 text-black/60 border border-black/8">
                SSL Secured
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
