"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import type { generateAvatarPreviewsTask } from "@/trigger/avatar-generation"
import { useRealtimeRun } from "@trigger.dev/react-hooks"
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Upload,
  UserRound,
  WandSparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

type AvatarStyle = "Podcast" | "Casual" | "3D Cartoon" | "Stylized"

type GenerationHandle = {
  runId: string
  publicAccessToken?: string
}

const styles: AvatarStyle[] = ["Podcast", "Casual", "3D Cartoon", "Stylized"]

const customAvatars = [
  { name: "Product Host", image: "/jen.png", tone: "Warm explainer", status: "Ready" },
  { name: "Launch Presenter", image: "/adam.png", tone: "Confident studio", status: "Ready" },
]

const defaultAvatars = [
  { name: "Emma", image: "/emma.png", tone: "Friendly onboarding", accent: "Podcast" },
  { name: "Jack", image: "/jack.png", tone: "Product walkthrough", accent: "Casual" },
  { name: "Adam", image: "/adam.png", tone: "Executive update", accent: "Stylized" },
  { name: "Jen", image: "/jen.png", tone: "Social creator", accent: "3D Cartoon" },
]

export function AvatarStudio() {
  const [open, setOpen] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>("Podcast")
  const [prompt, setPrompt] = useState("")
  const [uploadPreview, setUploadPreview] = useState<string>()
  const [uploadName, setUploadName] = useState<string>()
  const [handle, setHandle] = useState<GenerationHandle>()
  const [isStarting, setIsStarting] = useState(false)
  const [startError, setStartError] = useState<string>()
  const [uploadedAsIs, setUploadedAsIs] = useState(false)

  const { run, error: realtimeError } = useRealtimeRun<typeof generateAvatarPreviewsTask>(
    handle?.runId,
    {
      accessToken: handle?.publicAccessToken,
      enabled: Boolean(handle?.runId && handle?.publicAccessToken),
    }
  )

  const metadata = (run?.metadata ?? {}) as {
    progress?: number
    label?: string
    landscapeUrl?: string
    portraitUrl?: string
  }

  const output = run?.output as { landscapeUrl?: string; portraitUrl?: string } | undefined
  const landscapeUrl = output?.landscapeUrl ?? metadata.landscapeUrl
  const portraitUrl = output?.portraitUrl ?? metadata.portraitUrl
  const progress = uploadedAsIs ? 100 : metadata.progress ?? (isStarting ? 6 : 0)
  const statusLabel = uploadedAsIs
    ? "Uploaded avatar ready"
    : metadata.label ?? (isStarting ? "Starting Trigger.dev task" : "Waiting to generate")

  const canGenerate = Boolean(uploadPreview) && !isStarting && !run?.isExecuting && !run?.isQueued
  const hasResult = Boolean((landscapeUrl && portraitUrl) || uploadedAsIs)
  const uploadAsIsPreviews = useMemo(
    () =>
      uploadPreview
        ? {
            landscapeUrl: uploadPreview,
            portraitUrl: uploadPreview,
          }
        : undefined,
    [uploadPreview]
  )

  async function onUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    setUploadName(file.name)
    setUploadedAsIs(false)
    setHandle(undefined)
    setStartError(undefined)

    const reader = new FileReader()
    reader.onload = () => setUploadPreview(String(reader.result))
    reader.readAsDataURL(file)
  }

  async function startGeneration() {
    if (!uploadPreview) {
      setStartError("Upload an avatar image before generating.")
      return
    }

    setIsStarting(true)
    setStartError(undefined)
    setUploadedAsIs(false)

    try {
      const response = await fetch("/api/avatar-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl: uploadPreview,
          fileName: uploadName,
          style: selectedStyle,
          prompt,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to start avatar generation.")
      }

      setHandle(data)
    } catch (error) {
      setStartError(error instanceof Error ? error.message : "Unable to start avatar generation.")
    } finally {
      setIsStarting(false)
    }
  }

  function resetGeneration() {
    setHandle(undefined)
    setUploadedAsIs(false)
    setStartError(undefined)
  }

  function uploadAsIs() {
    if (!uploadPreview) {
      setStartError("Upload an avatar image before saving it as-is.")
      return
    }

    setHandle(undefined)
    setUploadedAsIs(true)
    setStartError(undefined)
  }

  const previewSet = uploadedAsIs ? uploadAsIsPreviews : { landscapeUrl, portraitUrl }

  return (
    <main className="min-h-svh bg-[#f7f7f2] text-zinc-950 dark:bg-[#111412] dark:text-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <header className="flex flex-col gap-4 border-b border-black/10 pb-6 dark:border-white/10 md:flex-row md:items-end md:justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-4 px-2">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Home
              </Link>
            </Button>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              <UserRound className="size-3.5 text-teal-600" />
              AI Avatars
            </div>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Build and choose avatars for your AI video scenes.
            </h1>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full md:w-auto">
                <Plus className="size-4" />
                Create New Avatar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[92svh] overflow-y-auto sm:max-w-5xl">
              <DialogHeader className="pr-8">
                <DialogTitle className="text-xl">Create New Avatar</DialogTitle>
                <DialogDescription>
                  Upload a reference image, choose a style, and generate responsive avatar previews.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                <section className="space-y-4">
                  <div className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <Label htmlFor="avatar-upload" className="text-sm font-semibold">
                      Upload user avatar image
                    </Label>
                    <label
                      htmlFor="avatar-upload"
                      className="mt-3 flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-center transition hover:border-zinc-500 hover:bg-white dark:border-white/20 dark:bg-black/20 dark:hover:bg-white/8"
                    >
                      {uploadPreview ? (
                        <Image
                          src={uploadPreview}
                          alt="Uploaded avatar reference"
                          width={320}
                          height={320}
                          className="size-40 rounded-lg object-cover shadow-lg"
                          unoptimized
                        />
                      ) : (
                        <span className="grid size-14 place-items-center rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                          <ImagePlus className="size-6" />
                        </span>
                      )}
                      <span className="max-w-64 text-sm font-medium">
                        {uploadName ?? "Choose a clear face or character image"}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">PNG, JPG, or WEBP</span>
                    </label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={onUpload}
                    />
                  </div>

                  <div className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <Label className="text-sm font-semibold">Select avatar style</Label>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {styles.map((style) => (
                        <button
                          type="button"
                          key={style}
                          onClick={() => setSelectedStyle(style)}
                          className={[
                            "flex min-h-12 items-center justify-between rounded-lg border px-3 text-left text-sm font-medium transition",
                            selectedStyle === style
                              ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                              : "border-black/10 bg-zinc-50 text-zinc-700 hover:bg-white dark:border-white/10 dark:bg-black/20 dark:text-zinc-200 dark:hover:bg-white/8",
                          ].join(" ")}
                        >
                          <span>{style}</span>
                          {selectedStyle === style && <Check className="size-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <Label htmlFor="avatar-prompt" className="text-sm font-semibold">
                      Optional prompt
                    </Label>
                    <Textarea
                      id="avatar-prompt"
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                      placeholder="Add wardrobe, lighting, mood, background, or brand direction..."
                      className="mt-3 min-h-28 resize-none"
                    />
                  </div>
                </section>

                <section className="space-y-4 rounded-lg border border-black/10 bg-zinc-50 p-4 dark:border-white/10 dark:bg-black/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">Generation status</p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{statusLabel}</p>
                    </div>
                    {(isStarting || run?.isExecuting || run?.isQueued) && (
                      <Loader2 className="size-5 animate-spin text-zinc-500" />
                    )}
                  </div>
                  <Progress value={progress} className="h-2" />

                  {(startError || realtimeError) && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                      {startError ?? realtimeError?.message}
                    </p>
                  )}

                  <div className="grid gap-3 md:grid-cols-2">
                    <PreviewFrame
                      label="16:9"
                      image={previewSet?.landscapeUrl}
                      className="aspect-video"
                    />
                    <PreviewFrame
                      label="9:16"
                      image={previewSet?.portraitUrl}
                      className="aspect-[9/16]"
                    />
                  </div>

                  {hasResult && (
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline">
                        <Check className="size-4" />
                        Use Avatar
                      </Button>
                      <Button variant="ghost" onClick={resetGeneration}>
                        <RefreshCw className="size-4" />
                        Generate a new one
                      </Button>
                    </div>
                  )}
                </section>
              </div>

              <DialogFooter className="items-center sm:justify-between">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button variant="outline" onClick={uploadAsIs} disabled={!uploadPreview}>
                    <Upload className="size-4" />
                    Upload as It Is
                  </Button>
                  <Button onClick={startGeneration} disabled={!canGenerate}>
                    {isStarting || run?.isExecuting || run?.isQueued ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <WandSparkles className="size-4" />
                    )}
                    Generate with AI
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight">Your custom avatars</h2>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{customAvatars.length} ready</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {customAvatars.map((avatar) => (
              <AvatarCard key={avatar.name} {...avatar} primaryAction="Use Avatar" secondaryAction="Edit" large />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight">Default avatars</h2>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{defaultAvatars.length} options</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {defaultAvatars.map((avatar) => (
              <AvatarCard
                key={avatar.name}
                {...avatar}
                status={avatar.accent}
                primaryAction="Choose"
                secondaryAction="Preview"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function AvatarCard({
  name,
  image,
  tone,
  status,
  primaryAction,
  secondaryAction,
  large,
}: {
  name: string
  image: string
  tone: string
  status: string
  primaryAction: string
  secondaryAction: string
  large?: boolean
}) {
  return (
    <article className="group overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 dark:border-white/10 dark:bg-white/5">
      <div className={["relative bg-zinc-200", large ? "aspect-[16/9]" : "aspect-[4/5]"].join(" ")}>
        <Image
          src={image}
          alt={`${name} avatar`}
          fill
          sizes={large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.72)_100%)]" />
        <span className="absolute left-3 top-3 rounded-md border border-white/20 bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          {status}
        </span>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
          <p className="mt-1 text-sm text-white/78">{tone}</p>
        </div>
      </div>
      <div className="flex gap-2 p-3">
        <Button className="flex-1">
          <Sparkles className="size-4" />
          {primaryAction}
        </Button>
        <Button variant="outline" className="flex-1">
          {secondaryAction}
        </Button>
      </div>
    </article>
  )
}

function PreviewFrame({
  label,
  image,
  className,
}: {
  label: string
  image?: string
  className: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{label} preview</p>
      </div>
      <div
        className={[
          "relative grid w-full place-items-center overflow-hidden rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-white/5",
          className,
        ].join(" ")}
      >
        {image ? (
          <Image src={image} alt={`${label} generated avatar preview`} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <ImagePlus className="size-7" />
            <span className="text-xs font-medium">Preview appears here</span>
          </div>
        )}
      </div>
    </div>
  )
}
