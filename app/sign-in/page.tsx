import * as React from "react"
import { Suspense } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Heart } from "lucide-react"
import { SignInForm } from "./sign-in-form"

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <Card className="w-full max-w-md border-border/80 shadow-xs">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-10 h-10 rounded-full bg-blush flex items-center justify-center text-primary">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <CardTitle className="font-serif text-2xl font-bold">
            Welcome to WedPlan
          </CardTitle>
          <CardDescription>
            Sign in to access your wedding dashboard or vendor portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="h-48 flex items-center justify-center text-muted-foreground text-xs">
                Loading sign-in...
              </div>
            }
          >
            <SignInForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
