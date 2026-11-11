import Link from "next/link"
import Image from "next/image"
import {
  Bot,
  Clapperboard,
  CreditCard,
  Home,
  Library,
  Mic2,
  Sparkles,
  UserRound,
  Video,
  WandSparkles,
} from "lucide-react"

const sidebarItems = [
  { label: "Home", icon: Home, href: "/", active: true },
  { label: "AI Video Agent", icon: Bot, href: "/" },
  { label: "AI Video Avatar", icon: Video, href: "/" },
  { label: "Avatar", icon: UserRound, href: "/avatars" },
  { label: "AI Voice Cloning", icon: Mic2, href: "/" },
  { label: "My Library", icon: Library, href: "/" },
]

const featureCards = [
  {
    name: "AI Video Agent",
    description: "Plan, prompt, and generate campaign-ready video concepts with an intelligent production agent.",
    icon: Bot,
    media: "/ai-video-agent.mp4",
    type: "video",
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    name: "AI Video Avatar",
    description: "Create presenter-led clips with realistic avatars and polished scene direction.",
    icon: Video,
    media: "/ai-avatar.mp4",
    type: "video",
    className: "lg:col-span-2",
  },
  {
    name: "Avatar",
    description: "Build expressive digital talent for product explainers, social content, and onboarding.",
    icon: UserRound,
    media: "/avatar%20(1).mp4",
    type: "video",
    className: "",
  },
  {
    name: "AI Voice Cloning",
    description: "Generate consistent brand voices for narration, localization, and avatar delivery.",
    icon: Mic2,
    media: "/voice-cloning.png",
    type: "image",
    className: "",
  },
  {
    name: "My Library",
    description: "Browse generated videos, avatars, voice assets, and saved creative building blocks.",
    icon: Library,
    media: "/my-library.mp4",
    type: "video",
    className: "lg:col-span-2",
  },
]

export default function DashboardHome() {
  return (
    <main className="min-h-svh bg-[#f6f7f4] text-zinc-950 dark:bg-[#111412] dark:text-zinc-50">
      <div className="flex min-h-svh flex-col lg:grid lg:grid-cols-[292px_minmax(0,1fr)]">
        <aside className="flex border-b border-black/10 bg-white/90 px-4 py-4 shadow-sm shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/88 lg:sticky lg:top-0 lg:h-svh lg:flex-col lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <div className="flex w-full flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 px-1">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <WandSparkles className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Next Avatar</p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">AI creation dashboard</p>
              </div>
            </Link>

            <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {sidebarItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={[
                    "flex h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-medium transition",
                    item.active
                      ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/10 dark:bg-white dark:text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white",
                  ].join(" ")}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-4 hidden border-t border-black/10 pt-4 dark:border-white/10 lg:mt-auto lg:block">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              <CreditCard className="size-4" />
              <span>User billing settings</span>
            </Link>
            <div className="mt-2 rounded-lg border border-black/10 bg-zinc-50 p-3 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Available credits
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">1,240</p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <header className="flex flex-col gap-4 border-b border-black/10 pb-6 dark:border-white/10 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                <Sparkles className="size-3.5 text-amber-500" />
                Dashboard Home
              </div>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
                Create videos, avatars, voices, and reusable assets from one calm workspace.
              </h1>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-white/5">
              <span className="grid size-10 place-items-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <Clapperboard className="size-5" />
              </span>
              <div className="pr-3">
                <p className="text-sm font-semibold">Creative suite</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">5 production tools</p>
              </div>
            </div>
          </header>

          <section className="mt-6 grid auto-rows-[260px] gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[230px] xl:auto-rows-[250px]">
            {featureCards.map((feature) => (
              <article
                key={feature.name}
                className={`group relative isolate overflow-hidden rounded-lg border border-white/15 bg-zinc-900 shadow-xl shadow-black/10 ${feature.className}`}
              >
                {feature.type === "video" ? (
                  <video
                    className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                    src={feature.media}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={`${feature.name} preview`}
                  />
                ) : (
                  <Image
                    className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                    src={feature.media}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.42)_42%,rgba(0,0,0,0.86)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_34%)] opacity-80" />

                <div className="relative flex h-full flex-col justify-between p-5 text-white sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-lg border border-white/20 bg-white/15 backdrop-blur-md">
                      <feature.icon className="size-5" />
                    </span>
                    <span className="rounded-md border border-white/15 bg-black/25 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
                      Open
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">{feature.name}</h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/78">{feature.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </section>
      </div>
    </main>
  )
}
