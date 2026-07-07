import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/admin-auth";

const defaultResume = {
  name: "Zabed Mahmud",
  role: "MERN Stack Developer",
  phone: "+8801979333880",
  email: "zabedfolio@gmail.com",
  location: "Chittagong, Bangladesh",
  linkedin: "https://www.linkedin.com/in/zabedfolio/",
  github: "https://github.com/Zabedfolio",
  portfolio: "https://zabedmahmud.com",
  objective: "MERN Stack Developer passionate about building performant web apps with modern JavaScript frameworks, clean code, and continuous growth.",
  skills: {
    frontend: "HTML5, CSS3, JavaScript (ES6+), React.js, Next.js, Tailwind CSS, Hero UI, Responsive Design",
    backend: "Node.js, Express.js, REST API, MongoDB, JWT Authentication",
    tools: "Git & GitHub, VS Code, Chrome DevTools, Better Auth",
    softSkills: "Problem Solving, Team Collaboration, Attention to Detail, Quick Learner"
  },
  projects: [
    {
      title: "SportNest – Sports Facility Booking Platform",
      liveLink: "https://sport-nest-zabedfolio.vercel.app/",
      clientLink: "https://github.com/Zabedfolio/SportNest-Client",
      serverLink: "https://github.com/Zabedfolio/SportNest-Server",
      description: "A full-stack sports facility booking platform where users can discover venues, reserve time slots, and manage bookings with secure authentication.",
      technologies: "Next.js, React.js, Node.js, Express.js, Tailwind CSS, MongoDB, Better Auth, Hero UI",
      features: [
        "Browse & Book — Explore facilities, check pricing and slots, and reserve instantly.",
        "Secure Auth — Register/login to access bookings and manage your reservations.",
        "Owner Tools — List, update, and delete venues via protected management routes."
      ]
    },
    {
      title: "WanderLust – Travel Booking Platform",
      liveLink: "https://wanderlust-zabedfolio.vercel.app/",
      clientLink: "https://github.com/Zabedfolio/WanderLust",
      serverLink: "https://github.com/Zabedfolio/WanderLust-Server",
      description: "A full-stack travel booking platform where users can browse destinations, book trips, and manage reservations with Google OAuth and email authentication.",
      technologies: "Next.js, React.js, Node.js, Express.js, Tailwind CSS, MongoDB, Better Auth, Hero UI",
      features: [
        "Browse & Book — Filter packages, view destinations, and book trips instantly.",
        "Secure Auth — Email/password & Google OAuth with protected routes.",
        "Manage — Cancel bookings from dashboard; admins manage destinations via JWT-secured API."
      ]
    }
  ],
  education: [
    {
      school: "International Islamic University Chattogram",
      degree: "B.Sc. in Computer Science & Engineering",
      year: "2023 – 2027"
    }
  ],
  languages: [
    {
      language: "Bengali",
      proficiency: "Native"
    },
    {
      language: "English",
      proficiency: "Professional Working Proficiency"
    }
  ]
};

export async function GET(request) {
  try {
    const { error } = await requireAdminSession(request);
    if (error) return error;

    const db = await getDb();
    let resume = await db.collection("resume").findOne({});
    if (!resume) {
      // Auto-initialize
      const newDoc = { ...defaultResume, createdAt: new Date() };
      const result = await db.collection("resume").insertOne(newDoc);
      resume = { ...newDoc, _id: result.insertedId.toString() };
    } else {
      resume._id = resume._id.toString();
    }
    return NextResponse.json(resume);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { error } = await requireAdminSession(request);
    if (error) return error;

    const db = await getDb();
    const body = await request.json();
    const { _id, createdAt, updatedAt, ...updateData } = body;

    const result = await db.collection("resume").findOneAndUpdate(
      {},
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: "after", upsert: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
    }

    if (result._id) {
      result._id = result._id.toString();
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
