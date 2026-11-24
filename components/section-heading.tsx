import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
}

// Editorial section heading with Playfair typography
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center"

  return (
    <div
      className={cn(
        "space-y-2 mb-8 md:mb-12",
        isCenter ? "text-center mx-auto max-w-2xl" : "text-left max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <p className="text-xs font-medium tracking-normal text-primary-text">
          {eyebrow}
        </p>
      )}

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
