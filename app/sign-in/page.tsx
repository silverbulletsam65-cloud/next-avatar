import { Suspense } from "react"

import { AuthPanel } from "@/components/auth/auth-panel"

export const metadata = {
  title: "Sign in | AI Studio",
}

export default function SignInPage() {
  return (
    <Suspense>
      <AuthPanel mode="sign-in" />
    </Suspense>
  )
}
