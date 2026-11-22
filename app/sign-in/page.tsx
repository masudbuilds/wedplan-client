import Link from "next/link"
import { Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center">
      <Card className="w-full max-w-md border-border/80 shadow-xs">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-10 h-10 rounded-full bg-blush flex items-center justify-center text-primary">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <CardTitle className="font-serif text-2xl font-bold">Welcome to WedPlan</CardTitle>
          <CardDescription>
            Sign in to access your wedding dashboard or vendor portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-xl">
            Authentication with Better Auth and role verification will be hooked up in Phase 2.
          </p>
          <div className="space-y-2 pt-2">
            <Button asChild className="w-full rounded-full">
              <Link href="/design-preview">Explore Design Preview Switcher</Link>
            </Button>
            <div className="text-xs text-muted-foreground pt-2">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-primary font-medium hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
