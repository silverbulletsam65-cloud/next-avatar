import Link from "next/link"
import {
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  Bot,
  ChevronRight,
  Clapperboard,
  Command,
  CreditCard,
  ImagePlus,
  Layers3,
  Play,
  RadioTower,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { SessionPill } from "@/components/auth/session-pill"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { label: "Studio", active: true },
  { label: "Projects", active: false },
  { label: "Assets", active: false },
  { label: "Models", active: false },
  { label: "Billing", active: false },
]

const statCards = [
  { label: "Monthly renders", value: "1,284", change: "+18.2%", icon: Clapperboard },
  { label: "Avg. render time", value: "42s", change: "-9.5%", icon: Wand2 },
  { label: "Model spend", value: "$342", change: "72% cap", icon: CreditCard },
  { label: "Team seats", value: "12", change: "4 online", icon: RadioTower },
]

const projects = [
  { name: "Launch teaser", status: "Rendering", progress: 82, accent: "bg-emerald-500" },
  { name: "Avatar onboarding", status: "Review", progress: 64, accent: "bg-sky-500" },
  { name: "Product cutdowns", status: "Queued", progress: 28, accent: "bg-rose-500" },
]

const timeline = [
  "Google OAuth connected through InsForge",
  "Storyboard generated for Launch teaser",
  "Brand kit synced across 18 scenes",
  "Usage guardrail held spend below cap",
]

export default function Home() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="grid min-h-svh lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-border/70 bg-sidebar/80 px-5 py-6 backdrop-blur lg:block">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
              AI
            </span>
            <div>
              <p className="text-sm font-semibold">AI Studio</p>
              <p className="text-xs text-muted-foreground">Creative OS</p>
            </div>
          </Link>

          <nav className="mt-9 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href="/"
                className={[
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  item.active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
                {item.active ? <ChevronRight className="size-4" /> : null}
              </Link>
            ))}
          </nav>

          <div className="mt-9 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary" />
              Studio capacity
            </div>
            <Progress value={72} className="h-2" />
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              72% of this month&apos;s render budget used. Upgrade controls are ready.
            </p>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/86 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Link href="/" className="flex items-center gap-2 lg:hidden">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary text-xs font-semibold text-primary-foreground">
                    AI
                  </span>
                </Link>
                <div className="relative hidden w-full max-w-sm sm:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    aria-label="Search"
                    placeholder="Search projects, assets, models"
                    className="h-10 rounded-xl bg-muted/60 pl-9"
                  />
                </div>
              </div>
              <ThemeToggle />
              <SessionPill />
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <section className="overflow-hidden rounded-3xl border border-border/70 bg-[linear-gradient(135deg,var(--card)_0%,var(--muted)_52%,color-mix(in_oklch,var(--accent),var(--background)_30%)_100%)] p-5 shadow-2xl shadow-primary/8 sm:p-8">
              <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
                <div className="max-w-3xl">
                  <Badge variant="secondary" className="mb-5 rounded-full px-3 py-1">
                    <BadgeCheck className="size-3" />
                    InsForge auth enabled
                  </Badge>
                  <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                    Produce AI video campaigns from one polished workspace.
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                    Plan scenes, generate avatar clips, review variants, and control model spend with a dashboard designed for serious SaaS teams.
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg" className="h-11 rounded-xl">
                      <Link href="/sign-up">
                        Create workspace
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-11 rounded-xl bg-background/70">
                      <Link href="/sign-in">
                        Sign in
                        <Command className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background/75 p-4 shadow-xl shadow-primary/10 backdrop-blur">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Active generation</p>
                      <p className="text-xs text-muted-foreground">Launch teaser campaign</p>
                    </div>
                    <Button size="icon" variant="secondary" aria-label="Preview render">
                      <Play className="size-4" />
                    </Button>
                  </div>
                  <div className="aspect-video overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0f172a,#2563eb_48%,#14b8a6)] p-4 text-white shadow-inner">
                    <div className="flex h-full flex-col justify-between rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                      <Bot className="size-8" />
                      <div>
                        <p className="text-lg font-semibold">Scene 07</p>
                        <p className="text-sm text-white/75">Avatar close-up, product reveal, kinetic captions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((stat) => (
                <Card key={stat.label} className="rounded-2xl shadow-sm">
                  <CardContent className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p>
                      <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">{stat.change}</p>
                    </div>
                    <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <stat.icon className="size-5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers3 className="size-5 text-primary" />
                    Production pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.name} className="rounded-2xl border border-border bg-background/60 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className={`size-2.5 rounded-full ${project.accent}`} />
                          <div>
                            <p className="font-medium">{project.name}</p>
                            <p className="text-xs text-muted-foreground">{project.status}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid gap-6">
                <Card className="rounded-2xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Blocks className="size-5 text-primary" />
                      Fast actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    {[
                      { label: "New scene", icon: ImagePlus },
                      { label: "Prompt kit", icon: Wand2 },
                      { label: "Model lane", icon: Bot },
                      { label: "Brand asset", icon: Sparkles },
                    ].map((action) => (
                      <Button
                        key={action.label}
                        variant="outline"
                        className="h-20 flex-col gap-2 rounded-2xl bg-background/70"
                      >
                        <action.icon className="size-5" />
                        {action.label}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {timeline.map((item) => (
                      <div key={item} className="flex items-start gap-3 text-sm">
                        <span className="mt-1.5 size-2 rounded-full bg-primary" />
                        <p className="leading-6 text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}
