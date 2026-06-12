"use client"

import { createClient } from "@insforge/sdk"

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY

if (!baseUrl || !anonKey) {
  throw new Error("Missing NEXT_PUBLIC_INSFORGE_BASE_URL or NEXT_PUBLIC_INSFORGE_ANON_KEY")
}

export const insforge = createClient({
  baseUrl,
  anonKey,
})

type InsForgeUser = {
  id: string
  email?: string
  providers?: string[]
  profile?: Record<string, unknown> | null
}

export async function syncUserProfile(user: InsForgeUser | null | undefined) {
  if (!user?.id || !user.email) return

  await insforge.database
    .from("users")
    .upsert({
      id: user.id,
      email: user.email,
      name: typeof user.profile?.name === "string" ? user.profile.name : null,
      avatar_url:
        typeof user.profile?.avatar_url === "string" ? user.profile.avatar_url : null,
      provider: user.providers?.[0] ?? "email",
      last_sign_in_at: new Date().toISOString(),
    })
}
