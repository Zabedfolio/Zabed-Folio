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
                            Passionate and detail-oriented Junior Frontend Developer eager to build performant, user-friendly web applications using modern
                            JavaScript frameworks. Committed to writing clean, scalable code and continuously expanding skills through real-world projects.
                            Seeking an opportunity to contribute meaningfully to a forward-thinking team and grow as a professional developer.
                        </p>
                    </div>

                    {/* Skills */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Technical Skills</h2>
                        <ul className="text-gray-600 space-y-1">
                            <li><span className="font-semibold">Languages & Markup:</span> HTML5, CSS3, JavaScript (ES6+)</li>
                            <li><span className="font-semibold">Frameworks & Libraries:</span> React.js, Next.js, Vue.js, Tailwind CSS</li>
                            <li><span className="font-semibold">Backend & APIs:</span> Node.js, Express.js, REST APIs</li>
                            <li><span className="font-semibold">Tools & Version Control:</span> Git, GitHub</li>
                            <li><span className="font-semibold">Soft Skills:</span> Problem Solving, Team Collaboration, Attention to Detail, Quick Learner</li>
                        </ul>
                    </div>

                    {/* Projects */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Projects</h2>

                        <div className="mb-4">
                            <h3 className="font-semibold">SportNest – Sports Facility Booking Platform</h3>
                            <p className="text-gray-600 text-sm">
                                A full-stack sports facility booking platform where users can discover venues, reserve time slots, and manage bookings with secure
                                authentication.
                            </p>
                            <ol className="text-gray-600 space-y-1 text-sm  mt-2 list-disc list-inside">
                                <li>Users can browse, filter, and view sports facilities with pricing, capacity, and available time slot details.</li>
                                <li>Session-based authentication (Better Auth + MongoDB) allows users to register, log in, and access protected booking and
                                    management pages securely.</li>
                                <li>Real-time slot selection and booking system lets authenticated users reserve specific time slots, with a personal My Bookings
                                    dashboard to view and manage reservations.</li>
                                <li>Facility owners can list, update, and delete their venues through a dedicated management flow with role-based protected
                                    routes.</li>
                            </ol>

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