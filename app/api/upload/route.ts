import { NextRequest, NextResponse } from "next/server"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB limit
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400 }
      )
    }

    // 1. Validate MIME Type (jpg, png, webp only)
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid file format. Only JPG, PNG, and WebP images are allowed.",
        },
        { status: 400 }
      )
    }

    // 2. Validate File Size (up to 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Image exceeds 5MB size limit. Please choose a smaller photo.",
        },
        { status: 400 }
      )
    }

    const apiKey = process.env.IMGBB_API_KEY

    // Missing API Key handling
    if (!apiKey || apiKey === "sample_imgbb_key") {
      // In production, missing credentials must strictly return a 500 server error
      if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Image upload service is unconfigured. IMGBB_API_KEY is missing on the server.",
          },
          { status: 500 }
        )
      }

      // Development-only fallback: allows testing registration and services locally before setting up an ImgBB key
      return NextResponse.json({
        success: true,
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        message:
          "Development fallback image returned (IMGBB_API_KEY not configured).",
      })
    }

    // 3. Upload to ImgBB via multipart FormData
    const imgbbForm = new FormData()
    imgbbForm.append("image", file)

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: imgbbForm,
      }
    )

    const result = await response.json()

    if (!response.ok || !result.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            result?.error?.message ||
            "Failed to upload image to ImgBB hosting service.",
        },
        { status: 500 }
      )
    }

    const imageUrl = result.data?.display_url || result.data?.url

    return NextResponse.json({
      success: true,
      url: imageUrl,
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Image processing error."
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
