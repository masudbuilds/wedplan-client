import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/section-heading"

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush/80 border border-primary/20 text-xs font-medium text-primary">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Browse Services Marketplace</span>
      </div>

      <SectionHeading
        eyebrow="Curated Wedding Directory"
        title="Explore Wedding Services"
        subtitle="This full browse & filter catalog with category filtering, location search, and price sorting will be implemented in the next phase."
      />

      <div className="flex justify-center gap-3 pt-4">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <Button asChild className="rounded-full">
          <Link href="/design-preview">View Design Preview</Link>
        </Button>
      </div>
    </div>
  )
}
