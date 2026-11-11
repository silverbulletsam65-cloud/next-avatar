import { metadata, task } from "@trigger.dev/sdk/v3"

type AvatarStyle = "Podcast" | "Casual" | "3D Cartoon" | "Stylized"

type AvatarGenerationPayload = {
  imageDataUrl?: string
  fileName?: string
  style: AvatarStyle
  prompt?: string
}

type AvatarGenerationOutput = {
  landscapeUrl: string
  portraitUrl: string
}

const GEMINI_MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image-preview"

export const generateAvatarPreviewsTask = task({
  id: "generate-avatar-previews",
  maxDuration: 600,
  run: async (payload: AvatarGenerationPayload): Promise<AvatarGenerationOutput> => {
    metadata.replace({
      progress: 8,
      label: "Preparing avatar reference",
      style: payload.style,
    })

    const landscapeUrl = await generateGeminiAvatar(payload, "16:9")

    metadata.replace({
      progress: 58,
      label: "Creating vertical avatar preview",
      style: payload.style,
      landscapeUrl,
    })

    const portraitUrl = await generateGeminiAvatar(payload, "9:16")

    metadata.replace({
      progress: 100,
      label: "Avatar previews ready",
      style: payload.style,
      landscapeUrl,
      portraitUrl,
    })

    return { landscapeUrl, portraitUrl }
  },
})

async function generateGeminiAvatar(payload: AvatarGenerationPayload, ratio: "16:9" | "9:16") {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY.")
  }

  metadata.set("progress", ratio === "16:9" ? 26 : 76)
  metadata.set("label", `Generating ${ratio} ${payload.style.toLowerCase()} avatar`)

  const imagePart = payload.imageDataUrl ? dataUrlToGeminiPart(payload.imageDataUrl) : undefined
  const prompt = [
    `Generate a polished AI avatar image in a ${ratio} aspect ratio.`,
    `Avatar style: ${payload.style}.`,
    "Use the uploaded person/image as the main identity reference when present.",
    "Make it clean, modern, visually appealing, suitable for an AI video avatar picker.",
    "Avoid text, watermarks, logos, and UI chrome in the image.",
    payload.prompt ? `User customization prompt: ${payload.prompt}` : "",
  ]
    .filter(Boolean)
    .join(" ")

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [imagePart, { text: prompt }].filter(Boolean),
          },
        ],
        generationConfig: {
          responseModalities: ["IMAGE"],
        },
      }),
    }
  )

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Gemini image generation failed: ${message}`)
  }

  const data = await response.json()
  const parts = data?.candidates?.[0]?.content?.parts ?? []
  const inline = parts.find((part: GeminiImagePart) => part.inlineData || part.inline_data)
  const inlineData = inline?.inlineData ?? inline?.inline_data

  const mimeType = inlineData?.mimeType ?? inlineData?.mime_type

  if (!inlineData?.data || !mimeType) {
    throw new Error("Gemini did not return an image preview.")
  }

  return `data:${mimeType};base64,${inlineData.data}`
}

function dataUrlToGeminiPart(dataUrl: string) {
  const match = dataUrl.match(/^data:([\w/+.-]+);base64,(.+)$/)

  if (!match?.[1] || !match[2]) {
    throw new Error("Avatar upload must be a base64 data URL.")
  }

  return {
    inline_data: {
      mime_type: match[1],
      data: match[2],
    },
  }
}

type GeminiImagePart = {
  inlineData?: {
    mimeType?: string
    data?: string
  }
  inline_data?: {
    mimeType?: string
    mime_type?: string
    data?: string
  }
}
