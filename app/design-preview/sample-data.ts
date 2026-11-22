import { Service, ServiceCategory } from "@/types"

export const SAMPLE_SERVICES: Service[] = [
  {
    id: "serv-1",
    vendorId: "vend-1",
    vendorName: "Julian & Co. Photography",
    vendorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    serviceName: "Editorial Wedding Photo & Cinema",
    category: "Photography & Videography",
    description: "Full-day fine art photography, cinematic 4K highlight reel, and drone coverage for romantic celebrations.",
    price: 3200,
    location: "Brooklyn, New York",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
    ],
    status: "approved",
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "serv-2",
    vendorId: "vend-2",
    vendorName: "Rosewood Glasshouse Estates",
    vendorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    serviceName: "Grand Conservatory & Botanical Gardens",
    category: "Wedding Venues",
    description: "Panoramic light-filled greenhouse venue hosting up to 250 seated guests with outdoor cocktail terraces.",
    price: 8500,
    location: "Hudson Valley, NY",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"
    ],
    status: "approved",
    createdAt: "2026-02-01T12:00:00.000Z",
  },
  {
    id: "serv-3",
    vendorId: "vend-3",
    vendorName: "Petal & Stem Floral Studio",
    vendorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    serviceName: "Romantic Bespoke Arches & Tablescapes",
    category: "Decoration & Florist",
    description: "Organic seasonal florals, dramatic ceremony arches, and European garden-inspired bridal bouquets.",
    price: 2400,
    location: "Manhattan, New York",
    images: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
    ],
    status: "approved",
    createdAt: "2026-02-10T14:00:00.000Z",
  },
]

export const ALL_CATEGORIES: ServiceCategory[] = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
]
