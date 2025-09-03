// app/verify-email/page.tsx
"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { account } from "@/lib/appwrite"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, XCircle } from "lucide-react"

function VerifyEmailClient() {
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const userId = params.get("userId")
    const secret = params.get("secret")

    if (!userId || !secret) {
      setStatus("success") // visiting directly or already verified
      return
    }

    setStatus("verifying")
    account
      .updateVerification(userId, secret)
      .then(() => setStatus("success"))
      .catch((e) => {
        setError(e?.message || "Verification failed")
        setStatus("error")
      })
  }, [params])

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <CardTitle>Verifying your email…</CardTitle>
            <CardDescription>This will only take a moment.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle>Verification failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => router.push("/login")}>
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle>Email verified!</CardTitle>
          <CardDescription>You can now access all features.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/">Continue to app</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              <CardTitle>Loading…</CardTitle>
              <CardDescription>Preparing verification page.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  )
}
