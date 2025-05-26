import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get("lang") || "en"

  try {
    const filePath = path.join(process.cwd(), "public", "translations", `${lang}.json`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `Translation file for ${lang} not found` }, { status: 404 })
    }

    const fileContent = fs.readFileSync(filePath, "utf8")
    const translations = JSON.parse(fileContent)

    return NextResponse.json(translations)
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error)
    return NextResponse.json({ error: `Failed to load translations for ${lang}` }, { status: 500 })
  }
}
