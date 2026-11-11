import { tasks } from "@trigger.dev/sdk/v3"
import type { generateAvatarPreviewsTask } from "@/trigger/avatar-generation"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const handle = await tasks.trigger<typeof generateAvatarPreviewsTask>(
      "generate-avatar-previews",
      payload
    )

    return Response.json({
      runId: handle.id,
      publicAccessToken: handle.publicAccessToken,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start avatar generation."

    return Response.json({ message }, { status: 500 })
  }
}
