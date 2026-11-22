import * as React from "react"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { SignUpForm } from "./sign-up-form"

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <Card className="w-full max-w-lg border-border/80 shadow-xs">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-10 h-10 rounded-full bg-blush flex items-center justify-center text-primary">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <CardTitle className="font-serif text-2xl font-bold">
            Create Your WedPlan Account
          </CardTitle>
          <CardDescription>
            Join as a couple planning a wedding or as a professional vendor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="h-64 flex items-center justify-center text-muted-foreground text-xs">
                Loading registration form...
              </div>
            }
          >
            <SignUpForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
