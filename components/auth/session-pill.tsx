"use client"

import * as React from "react"
import Link from "next/link"
import { LogOut, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { insforge, syncUserProfile } from "@/lib/insforge"

type CurrentUser = {
  id: string
  email?: string
  providers?: string[]
  profile?: {
    name?: string
    avatar_url?: string
  } | null
}

export function SessionPill() {
  const [user, setUser] = React.useState<CurrentUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let active = true

    insforge.auth.getCurrentUser().then(({ data }) => {
      if (!active) return
      void syncUserProfile(data?.user as CurrentUser | null).catch(() => null)
      setUser((data?.user as CurrentUser | null) ?? null)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  async function signOut() {
    setLoading(true)
    await insforge.auth.signOut()
    setUser(null)
    setLoading(false)
  }

  if (loading) {
    return <div className="h-9 w-32 animate-pulse rounded-lg bg-muted" />
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="lg">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/sign-up">Start free</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/80 p-1 shadow-sm backdrop-blur">
      <div className="flex min-w-0 items-center gap-2 px-2">
        <div className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <UserRound className="size-4" />
        </div>
        <span className="hidden max-w-40 truncate text-sm font-medium sm:block">
          {user.profile?.name || user.email}
        </span>
      </div>
      <Button type="button" variant="ghost" size="icon" aria-label="Sign out" onClick={signOut}>
        <LogOut className="size-4" />
      </Button>
    </div>
  )
}
