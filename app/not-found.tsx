import Link from "next/link"
import { Heart } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] px-4 py-16 text-center">
      <div className="space-y-6 max-w-md">
        {/* Thematic Icon */}
        <div className="mx-auto w-14 h-14 rounded-full bg-blush flex items-center justify-center text-primary shadow-xs">
          <Heart className="w-7 h-7 fill-current opacity-80" />
        </div>

        {/* 404 Heading */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-primary-text">
            404 error
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed pt-1">
            The page or service you were looking for doesn&apos;t seem to exist, or may have been moved.
          </p>
        </div>

        {/* Actions without arrows */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-full px-6"
            )}
          >
            Return to Home
          </Link>

          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full px-6 bg-card"
            )}
          >
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  )
}
