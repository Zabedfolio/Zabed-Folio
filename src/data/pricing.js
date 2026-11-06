/**
 * Pricing configuration file
 * Single source of truth for packages, add-ons, copy, and currency rules.
 */

export const CURRENCIES = {
  BDT: {
    code: "BDT",
    symbol: "৳",
    locale: "bn-BD",
    name: "BDT",
  },
  USD: {
    code: "USD",
    symbol: "$",
    locale: "en-US",
    name: "USD",
  },
};

export const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Individuals & small shops",
    price: {
      BDT: 12000,
      USD: 99,
    },
    turnaround: {
      standard: "5-7 days",
      fastTrack: "3-4 days",
    },
    revisions: "4 revision rounds",
    support: "30 days free support",
    badge: null,
    features: [
      "Up to 5 pages",
      "Template-based, customized design",
      "Mobile responsive",
      "Basic SEO",
      "Contact form",
      "Deployment on client's hosting",
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "Growing businesses",
    price: {
      BDT: 25000,
      USD: 219,
    },
    turnaround: {
      standard: "10-14 days",
      fastTrack: "5-7 days",
    },
    revisions: "8 revision rounds",
    support: "60 days free support",
    badge: "Most Popular",
    features: [
      "Up to 10 pages",
      "Custom design",
      "Mobile responsive",
      "Basic SEO",
      "Contact form",
      "Admin panel (client edits own content)",
      "Analytics setup",
      "Deployment on client's hosting",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "E-commerce & established brands",
    price: {
      BDT: 50000,
      USD: 429,
    },
    turnaround: {
      standard: "20-30 days",
      fastTrack: "10-15 days",
    },
    revisions: "15 revision rounds",
    support: "90 days free support",
    badge: null,
    features: [
      "Unlimited/custom pages",
      "Fully custom design",
      "Mobile responsive",
      "Advanced SEO",
      "Contact form",
      "Admin panel",
      "Online store with bKash / Nagad / card payments",
      "Analytics setup",
      "Deployment on client's hosting",
    ],
  },
];

export const ADDONS = [
  {
    id: "fast",
    name: "Fast Track",
    subtitle: "Rush turnaround (~50% faster delivery)",
    isPercentage: true,
    percentage: 0.4, // +40% of package base price
    isRecurring: false,
    icon: "zap",
    featureText: "Priority delivery & rush turnaround",
  },
  {
    id: "logo",
    name: "Logo design",
    subtitle: "Custom brand mark & web assets",
    isPercentage: false,
    price: {
      BDT: 5000,
      USD: 45,
    },
    isRecurring: false,
    icon: "palette",
    featureText: "Custom logo design & branding assets",
  },
  {
    id: "domain",
    name: "Domain & hosting setup help",
    subtitle: "DNS, SSL & live deployment setup (you buy direct)",
    isPercentage: false,
    price: {
      BDT: 1000,
      USD: 10,
    },
    isRecurring: false,
    icon: "globe",
    featureText: "Domain, DNS, SSL & hosting configuration",
  },
  {
    id: "maintenance",
    name: "Monthly maintenance",
    subtitle: "Updates, security patches & automated backups",
    isPercentage: false,
    price: {
      BDT: 2000,
      USD: 20,
    },
    isRecurring: true, // Not added to one-time total!
    icon: "shield",
    featureText: "Ongoing monthly updates & security backups",
  },
];

export const PRICING_COPY = {
  sectionLabel: "Pricing",
  heading: "Choose what works for you",
  subtext: "Transparent fixed pricing. Pick a package, toggle what you need, and see the price instantly.",
  ctaText: "Book a 30-min call",
  notes: [
    "Domain and hosting are not included. You purchase them separately and I'll help you set them up.",
    "A revision round is one batch of changes sent together. Work outside the original scope is quoted separately.",
    "Not sure which package fits? Book a free call and we'll figure it out.",
  ],
};

/**
 * Format currency without decimals
 */
export function formatCurrency(amount, currencyCode = "BDT") {
  const rounded = Math.round(amount);
  if (currencyCode === "BDT") {
    // Standard format for BDT with ৳ symbol
    return `৳${rounded.toLocaleString("en-IN")}`;
  }
  return `$${rounded.toLocaleString("en-US")}`;
}

