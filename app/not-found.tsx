import Link from "next/link"
import { Heart, ArrowLeft, Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] px-4 py-16 text-center">
      <div className="space-y-6 max-w-lg">
        {/* Thematic Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-blush flex items-center justify-center text-primary shadow-xs">
          <Heart className="w-8 h-8 fill-current opacity-80" />
        </div>

        {/* 404 Heading */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            404 — Page Not Found
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground">
            A Moment Lost in Time
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-1">
            The celebration, service, or page you were looking for doesn&apos;t seem to exist, or may have moved to a new address.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-full px-6 gap-2"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full px-6 gap-2"
            )}
          >
            <Search className="w-4 h-4" />
            <span>Browse Services</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
