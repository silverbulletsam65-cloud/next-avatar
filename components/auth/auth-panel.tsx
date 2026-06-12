"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, CheckCircle2, Loader2, Mail, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { insforge, syncUserProfile } from "@/lib/insforge"

type AuthMode = "sign-in" | "sign-up"

type FieldErrors = {
  name?: string
  email?: string
  password?: string
  code?: string
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.24 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.7l-5.2-6.8L5.6 22H2.3l7.7-8.8L1.8 2h6.8l4.7 6.2L18.9 2Zm-1.2 17.9h1.8L7.6 4H5.7l12 15.9Z" />
    </svg>
  )
}

function validate(mode: AuthMode, values: { name: string; email: string; password: string }) {
  const errors: FieldErrors = {}

  if (mode === "sign-up" && values.name.trim().length < 2) {
    errors.name = "Enter at least 2 characters."
  }

  if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Enter a valid email address."
  }

  if (values.password.length < 6) {
    errors.password = "Use at least 6 characters."
  }

  return errors
}

export function AuthPanel({ mode }: { mode: AuthMode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [code, setCode] = React.useState("")
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [message, setMessage] = React.useState("")
  const [formError, setFormError] = React.useState("")
  const [loading, setLoading] = React.useState<"form" | "google" | "verify" | null>(null)
  const [needsVerification, setNeedsVerification] = React.useState(false)

  const isSignUp = mode === "sign-up"
  const title = isSignUp ? "Create your AI Studio account" : "Welcome back to AI Studio"
  const subtitle = isSignUp
    ? "Start building production-ready AI video workflows with secure InsForge auth."
    : "Sign in to manage generations, brand kits, team workspaces, and model spend."
  const callbackMessage =
    searchParams.get("insforge_status") === "success" &&
    searchParams.get("insforge_type") === "verify_email"
      ? "Email verified. You can sign in now."
      : ""
  const callbackError =
    searchParams.get("insforge_status") === "error"
      ? searchParams.get("insforge_error") ?? ""
      : ""

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError("")
    setMessage("")

    const nextErrors = validate(mode, { name, email, password })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading("form")

    if (isSignUp) {
      const { data, error } = await insforge.auth.signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        redirectTo: `${window.location.origin}/sign-in`,
      })

      setLoading(null)
      if (error) {
        setFormError(error.message || "Unable to create the account.")
        return
      }

      if (data?.requireEmailVerification) {
        setNeedsVerification(true)
        setMessage("Check your inbox for the 6-digit verification code.")
        return
      }

      await syncUserProfile(data?.user)
      router.push("/")
      return
    }

    const { data, error } = await insforge.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(null)
    if (error) {
      setFormError(error.message || "Email or password is incorrect.")
      return
    }

    await syncUserProfile(data?.user)
    router.push("/")
  }

  async function verifyEmail() {
    const nextErrors: FieldErrors = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter the account email."
    if (!/^\d{6}$/.test(code)) nextErrors.code = "Enter the 6-digit code."
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setFormError("")
    setLoading("verify")
    const { data, error } = await insforge.auth.verifyEmail({
      email: email.trim(),
      otp: code.trim(),
    })
    setLoading(null)

    if (error) {
      setFormError(error.message || "The verification code could not be confirmed.")
      return
    }

    await syncUserProfile(data?.user)
    setMessage("Email verified. Taking you to the studio.")
    router.push("/")
  }

  async function signInWithGoogle() {
    setFormError("")
    setLoading("google")
    const { error } = await insforge.auth.signInWithOAuth("google", {
      redirectTo: window.location.origin,
      additionalParams: { prompt: "select_account" },
    })

    if (error) {
      setLoading(null)
      setFormError(error.message || "Google sign-in is unavailable right now.")
    }
  }

  return (
    <div className="grid min-h-svh bg-background text-foreground lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden overflow-hidden border-r border-border/70 bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_48%,var(--secondary)_100%)] p-10 text-primary-foreground lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,.34),transparent_26%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,.18),transparent_25%),linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.28))]" />
        <div className="relative flex h-full flex-col justify-between">
          <Link href="/" className="flex w-fit items-center gap-3 text-sm font-semibold">
            <span className="grid size-9 place-items-center rounded-xl bg-white/18 ring-1 ring-white/30 backdrop-blur">
              AI
            </span>
            AI Studio
          </Link>
          <div className="max-w-xl">
            <p className="mb-4 w-fit rounded-full bg-white/16 px-3 py-1 text-xs font-medium ring-1 ring-white/25">
              InsForge secured workspace
            </p>
            <h1 className="text-5xl font-semibold leading-tight">
              Ship premium AI video workflows with confidence.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/78">
              OAuth, verified email, project storage, realtime job status, and usage controls are ready to grow with your studio.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["24 active renders", "98.4% job success", "4 model lanes"].map((item) => (
              <div key={item} className="rounded-2xl bg-white/12 p-4 text-sm font-medium ring-1 ring-white/20 backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-3 text-sm font-semibold">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                AI
              </span>
              AI Studio
            </Link>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card/92 p-5 shadow-2xl shadow-primary/10 backdrop-blur sm:p-8">
            <div>
              <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</p>
            </div>

            <div className="mt-7 grid gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={signInWithGoogle}
                disabled={loading !== null}
                className="h-11 w-full justify-center gap-2 rounded-xl bg-background"
              >
                {loading === "google" ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled
                title="X/Twitter OAuth is not enabled for this InsForge project."
                className="h-11 w-full justify-center gap-2 rounded-xl bg-muted/50 text-muted-foreground"
              >
                <XIcon />
                Continue with X
              </Button>
            </div>

            <div className="my-6 flex items-center gap-3 text-xs font-medium text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or use email
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} className="space-y-4" noValidate>
              {isSignUp ? (
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ava Chen"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    className="h-11 rounded-xl bg-background"
                  />
                  {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className="h-11 rounded-xl bg-background"
                />
                {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isSignUp ? (
                    <Link href="/sign-in" className="text-xs font-medium text-primary">
                      Forgot?
                    </Link>
                  ) : null}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  aria-invalid={Boolean(errors.password)}
                  className="h-11 rounded-xl bg-background"
                />
                {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
              </div>

              {formError || callbackError ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError || callbackError}
                </div>
              ) : null}

              {message || callbackMessage ? (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="size-4" />
                  {message || callbackMessage}
                </div>
              ) : null}

              <Button type="submit" size="lg" disabled={loading !== null} className="h-11 w-full rounded-xl">
                {loading === "form" ? <Loader2 className="size-4 animate-spin" /> : null}
                {isSignUp ? "Create account" : "Sign in"}
                {loading !== "form" ? <ArrowRight className="size-4" /> : null}
              </Button>
            </form>

            {needsVerification ? (
              <div className="mt-5 rounded-2xl border border-border bg-muted/35 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <Mail className="size-4 text-primary" />
                  Verify your email
                </div>
                <div className="flex gap-2">
                  <Input
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    placeholder="000000"
                    aria-invalid={Boolean(errors.code)}
                    className="h-10 rounded-xl bg-background tracking-[0.3em]"
                  />
                  <Button type="button" onClick={verifyEmail} disabled={loading !== null} className="h-10 rounded-xl">
                    {loading === "verify" ? <Loader2 className="size-4 animate-spin" /> : "Verify"}
                  </Button>
                </div>
                {errors.code ? <p className="mt-2 text-xs text-destructive">{errors.code}</p> : null}
              </div>
            ) : null}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "New to AI Studio?"}{" "}
              <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-medium text-primary">
                {isSignUp ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
