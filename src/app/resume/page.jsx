'use client';

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { HiArrowDownTray } from "react-icons/hi2";

export default function ResumePage() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6 py-16">
      <div className="max-w-4xl w-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold tracking-tight">
            Zabed Mahmud
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Junior Frontend Developer
          </p>

          {/* Navigation */}
          <div className="mt-6 flex justify-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/projects" className="hover:underline">Projects</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-gray-200 p-8 shadow-sm"
        >

          {/* Objective */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Career Objective</h2>
            <p className="text-gray-600 leading-relaxed">
              Passionate Junior Frontend Developer focused on building performant,
              user-friendly web applications using modern frameworks like React
              and Next.js.
            </p>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Technical Skills</h2>
            <ul className="text-gray-600 space-y-1">
              <li>• HTML5, CSS3, JavaScript (ES6+)</li>
              <li>• React.js, Next.js, Vue.js, Tailwind CSS</li>
              <li>• Node.js, Express.js, REST APIs</li>
              <li>• Git, GitHub</li>
            </ul>
          </div>

          {/* Projects */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Projects</h2>

            <div className="mb-4">
              <h3 className="font-semibold">SportNest</h3>
              <p className="text-gray-600 text-sm">
                Sports facility booking platform with authentication,
                real-time slot booking, and management dashboard.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">WanderLust</h3>
              <p className="text-gray-600 text-sm">
                Travel booking platform with Google OAuth, booking system,
                and admin management features.
              </p>
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Education</h2>
            <p className="text-gray-600">
              B.Sc. in Computer Science & Engineering <br />
              International Islamic University Chittagong (2023 – Present)
            </p>
          </div>

          {/* Button */}
          <motion.div
            whileHover={reducedMotion ? {} : { y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="flex justify-center mt-10"
          >
            <a
              href="/resume.pdf"
              download
              className="flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-sm font-medium shadow-md hover:bg-gray-800 transition"
            >
              <HiArrowDownTray />
              Download PDF
            </a>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}