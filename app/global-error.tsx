"use client"

import * as React from "react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Optionally log to error reporting service
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FDFBF7] text-[#1E1B18] flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#E7E2DA] shadow-xs text-center space-y-5">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#E58C8A]/20 flex items-center justify-center text-[#7C2D37]">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-[#1E1B18]">
              Critical Application Error
            </h1>
            <p className="text-xs text-[#7A7265] leading-relaxed">
              A critical error prevented the application from rendering. Please click below to reset the interface.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => reset()}
              type="button"
              className="flex-1 py-2.5 px-4 rounded-full bg-[#7C2D37] text-white text-xs font-semibold hover:bg-[#68242D] transition-colors cursor-pointer"
            >
              Reset Application
            </button>
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 rounded-full border border-[#E7E2DA] text-[#1E1B18] text-xs font-semibold hover:bg-[#FDFBF7] transition-colors flex items-center justify-center"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
