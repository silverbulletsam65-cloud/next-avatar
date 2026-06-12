import { Suspense } from "react"

import { AuthPanel } from "@/components/auth/auth-panel"

export const metadata = {
  title: "Sign up | AI Studio",
}

export default function SignUpPage() {
  return (
    <Suspense>
      <AuthPanel mode="sign-up" />
    </Suspense>
  )
}
