'use client';

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { HiArrowDownTray, HiArrowLeft } from "react-icons/hi2";
import { useSearchParams } from "next/navigation";

function ResumeContent() {
  const reducedMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch("/api/public/resume");
        const data = await res.json();
        if (data && !data.error) {
          setResume(data);
          
          // If search param print=true is specified, trigger browser print window after render
          const isPrint = searchParams.get("print");
          if (isPrint === "true") {
            setTimeout(() => {
              window.print();
            }, 800);
          }
        }
      } catch (err) {
        console.error("Error loading resume:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium text-sm">Loading resume details...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <p className="text-red-500 font-semibold">Failed to load resume database. Please try again later.</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50/50 print:bg-white text-gray-900 flex flex-col items-center justify-center px-4 sm:px-6 py-12 print:p-0 print:py-0 print:my-0">
      
      {/* CSS Overrides for Premium 1-Page ATS Printing matching your exact template */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        @media print {
          @page {
            size: letter portrait;
            margin: 6mm 10mm !important; /* Overrides browser headers/footers cleanly */
          }
          
          /* Enforce 1-page constraints & fonts */
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            font-family: 'Inter', -apple-system, sans-serif !important;
            font-size: 10px !important;
            line-height: 1.35 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          section {
            min-height: 0 !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Strip card designs, borders, shadows */
          .shadow-sm, .rounded-3xl, .border {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }

          /* Precise layout elements */
          h1 {
            font-family: 'Inter', -apple-system, sans-serif !important;
            font-size: 26px !important;
            font-weight: 800 !important;
            margin: 0 0 2px 0 !important;
            line-height: 1.1 !important;
            color: #000000 !important;
          }
          h2 {
            font-family: 'Inter', -apple-system, sans-serif !important;
            font-size: 12px !important;
            font-weight: 700 !important;
            margin-top: 8px !important;
            margin-bottom: 4px !important;
            padding-bottom: 2px !important;
            border-bottom: 1.5px solid #000000 !important;
            color: #000000 !important;
          }
          h3 {
            font-size: 10px !important;
            margin: 0 !important;
          }
          p, li, span, a {
            font-size: 10px !important;
            color: #000000 !important;
          }

          /* Spacer adjustments */
          .mb-8, .mb-6, .mb-4 {
            margin-bottom: 4px !important;
          }
          .mt-4, .mt-3.5, .mt-2.5, .mt-2, .mt-1.5 {
            margin-top: 2px !important;
          }
          .pb-6, .pb-4 {
            padding-bottom: 3px !important;
          }
          .space-y-6, .space-y-4 {
            margin-top: 1px !important;
          }
          .space-y-6 > * + *, .space-y-4 > * + * {
            margin-top: 5px !important;
          }
          
          /* Links formatting */
          a {
            text-decoration: underline !important;
            color: #000000 !important;
          }
        }
      `}</style>
      
      {/* Navigation for web view */}
      <div className="max-w-4xl w-full mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black font-medium transition"
        >
          <HiArrowLeft />
          <span>Back to Portfolio</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-full bg-black text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-800 transition"
        >
          <HiArrowDownTray />
          <span>Download PDF</span>
        </button>
      </div>

      <div className="max-w-4xl w-full">
        {/* Main Resume Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-gray-200/80 bg-white p-8 sm:p-12 shadow-sm print:shadow-none print:border-none print:p-0"
        >
          {/* Header */}
          <div className="text-center mb-6 border-b border-gray-100 pb-5 print:pb-2 print:mb-2 print:border-transparent">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 print:text-black">
              {resume.name}
            </h1>
            <p className="mt-2 text-lg sm:text-xl font-bold text-gray-800 uppercase tracking-wider print:text-black print:mt-1">
              {resume.role}
            </p>
            
            <div className="mt-4 flex flex-col items-center text-xs sm:text-sm text-gray-500 gap-1.5 font-mono print:text-black print:mt-2">
              <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-1">
                {resume.phone && (
                  <>
                    <a href={`tel:${resume.phone}`} className="hover:underline text-gray-600 print:text-black">{resume.phone}</a>
                    <span className="text-gray-300 print:text-black">|</span>
                  </>
                )}
                {resume.email && (
                  <>
                    <a href={`mailto:${resume.email}`} className="hover:underline text-gray-600 print:text-black">{resume.email}</a>
                    <span className="text-gray-300 print:text-black">|</span>
                  </>
                )}
                <span>{resume.location}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-1">
                {resume.linkedin && (
                  <>
                    <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 font-medium print:text-black print:underline">LinkedIn</a>
                    <span className="text-gray-300 print:text-black">|</span>
                  </>
                )}
                {resume.github && (
                  <>
                    <a href={resume.github} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 font-medium print:text-black print:underline">GitHub</a>
                    <span className="text-gray-300 print:text-black">|</span>
                  </>
                )}
                {resume.portfolio && (
                  <a href={resume.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 font-medium print:text-black print:underline">Portfolio</a>
                )}
              </div>
            </div>
          </div>

          {/* Career Objective */}
          {resume.objective && (
            <div className="mb-6 print:mb-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-gray-200 pb-1.5 uppercase tracking-wide print:text-black print:border-black">
                Career Objective
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm mt-2.5 print:text-black print:mt-1">
                {resume.objective}
              </p>
            </div>
          )}

          {/* Technical Skills */}
          {resume.skills && (
            <div className="mb-6 print:mb-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-gray-200 pb-1.5 uppercase tracking-wide print:text-black print:border-black">
                Technical Skills
              </h2>
              <ul className="text-gray-600 space-y-2 text-sm mt-2.5 print:text-black print:mt-1 print:space-y-1.5">
                {resume.skills.frontend && (
                  <li>
                    <span className="font-bold text-gray-800 print:text-black">Frontend:</span> {resume.skills.frontend}
                  </li>
                )}
                {resume.skills.backend && (
                  <li>
                    <span className="font-bold text-gray-800 print:text-black">Backend & APIs:</span> {resume.skills.backend}
                  </li>
                )}
                {resume.skills.tools && (
                  <li>
                    <span className="font-bold text-gray-800 print:text-black">Tools & Version Control:</span> {resume.skills.tools}
                  </li>
                )}
                {resume.skills.softSkills && (
                  <li>
                    <span className="font-bold text-gray-800 print:text-black">Soft Skills:</span> {resume.skills.softSkills}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <div className="mb-6 print:mb-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-gray-200 pb-1.5 uppercase tracking-wide print:text-black print:border-black">
                Projects
              </h2>
              <div className="mt-3.5 space-y-6 print:space-y-3 print:mt-1.5">
                {resume.projects.map((project, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap text-sm">
                        <h3 className="font-extrabold text-gray-900 text-base print:text-black">
                          {project.title}
                        </h3>
                        
                        <span className="text-gray-300 print:hidden">|</span>
                        
                        {project.liveLink && (
                          <Link
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-semibold print:text-black print:underline"
                          >
                            Live
                          </Link>
                        )}

                        {project.clientLink && (
                          <>
                            <span className="text-gray-300 print:hidden">|</span>
                            <Link 
                              href={project.clientLink} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-semibold print:text-black print:underline"
                            >
                              Client
                            </Link>
                          </>
                        )}

                        {project.serverLink && (
                          <>
                            <span className="text-gray-300 print:hidden">|</span>
                            <Link 
                              href={project.serverLink} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-semibold print:text-black print:underline"
                            >
                              Server
                            </Link>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mt-1.5 leading-relaxed print:text-black print:mt-0.5">
                      {project.description}
                    </p>

                    {project.technologies && (
                      <p className="text-gray-800 text-xs mt-1.5 print:text-black print:mt-0.5">
                        <span className="font-bold">Technologies:</span> {project.technologies}
                      </p>
                    )}

                    {project.features && project.features.length > 0 && (
                      <ul className="text-gray-600 space-y-1 text-sm mt-2 list-none pl-0 print:text-black print:mt-0.5 print:space-y-0.5">
                        {project.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-gray-900 font-extrabold print:text-black select-none">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <div className="mb-6 print:mb-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-gray-200 pb-1.5 uppercase tracking-wide print:text-black print:border-black">
                Education
              </h2>
              <div className="mt-3.5 space-y-4 print:space-y-2 print:mt-1.5">
                {resume.education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="font-extrabold text-gray-900 text-sm sm:text-base print:text-black">
                      {edu.school}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 print:text-black print:mt-0.5 flex justify-between">
                      <span>{edu.degree}</span>
                      <span className="font-mono text-xs">{edu.year}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {resume.languages && resume.languages.length > 0 && (
            <div className="mb-4 print:mb-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 border-b border-gray-200 pb-1.5 uppercase tracking-wide print:text-black print:border-black">
                Languages
              </h2>
              <p className="text-gray-600 text-sm mt-2.5 print:text-black print:mt-1.5">
                {resume.languages.map((lang, idx) => (
                  <span key={idx}>
                    <span className="font-bold text-gray-800 print:text-black">{lang.language}</span> – {lang.proficiency}
                    {idx < resume.languages.length - 1 && <span className="mx-2.5 text-gray-300 print:text-black">|</span>}
                  </span>
                ))}
              </p>
            </div>
          )}

        </motion.div>
      </div>
    </section>
  );
}

export default function ResumePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResumeContent />
    </Suspense>
  );
}