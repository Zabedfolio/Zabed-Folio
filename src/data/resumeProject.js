export const resumeProject = [
  {
    title: "SportNest – Sports Facility Booking Platform",
    clientLink: "https://github.com/Zabedfolio/SportNest-Client",
    serverLink: "https://github.com/Zabedfolio/SportNest-Server",
    liveLink: "https://sport-nest-zabedfolio.vercel.app/",
    description:
      "A full-stack sports facility booking platform where users can discover venues, reserve time slots, and manage bookings with secure authentication.",
    features: [
      "Users can browse, filter, and view sports facilities with pricing, capacity, and available time slot details.",
      "Session-based authentication (Better Auth + MongoDB) allows secure login and protected routes.",
      "Real-time slot booking system with My Bookings dashboard.",
      "Role-based access for facility owners to manage venues."
    ]
  },
  {
    title: "WanderLust – Travel Booking Platform",
    clientLink: "https://github.com/Zabedfolio/WanderLust",
    serverLink: "https://github.com/Zabedfolio/WanderLust-Server",
    liveLink: "https://wanderlust-zabedfolio.vercel.app/",
    description:
      "A full-stack travel booking platform where users can browse destinations, book trips, and manage reservations with Google OAuth and email authentication.",
    features: [
      "Users can browse and filter travel packages by category and price, view destination detail pages with highlights, and book trips with a selected departure date.",
      "Secure authentication supports both email/password and Google OAuth via Better Auth, with session persistence and protected routes across all booking and management pages.",
      "Authenticated users can view and cancel their reservations from a personal My Bookings dashboard, with booking data stored and retrieved securely from MongoDB Atlas.",
      "Authorised users can add, edit, and delete travel destinations through a dedicated management flow, with the Express API server secured via JWKS JWT verification."
    ]
  }
];