/**
 * Application Constants
 *
 * Centralized configuration for external links, pricing, and category definitions.
 */

// Social profile links used across the site (e.g. in the footer).
// Replace these placeholder links with your real social media profile URLs.
export const SOCIAL_LINKS = {
  // Instagram profile URL
  instagram: "https://github.com/masudbuilds",
  // Facebook page URL
  facebook: "https://github.com/masudbuilds",
  // X (formerly Twitter) profile URL
  x: "https://github.com/masudbuilds",
  // GitHub profile / source repository URL
  github: "https://github.com/masudbuilds/wedplan-client",
} as const

// Subscription plan pricing configuration for vendor premium tier.
// Modify these constants to update the displayed and billed vendor plan price.
export const VENDOR_PREMIUM_PLAN = {
  name: "Premium Vendor",
  priceAmount: 49,
  priceDisplay: "$49",
  billingInterval: "/ month",
  billingDetails: "(auto-renews)",
  freeTierActiveLimit: 3,
} as const
