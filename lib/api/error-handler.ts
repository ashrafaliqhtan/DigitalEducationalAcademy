import { NextResponse } from "next/server"

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code?: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export function handleAPIError(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode },
    )
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
}

export function validateRequest(request: Request, requiredFields: string[]) {
  const url = new URL(request.url)
  const missing: string[] = []

  for (const field of requiredFields) {
    if (!url.searchParams.get(field)) {
      missing.push(field)
    }
  }

  if (missing.length > 0) {
    throw new APIError(`Missing required fields: ${missing.join(", ")}`, 400, "MISSING_FIELDS")
  }
}

export async function validateJSONBody(request: Request, schema?: any) {
  try {
    const body = await request.json()

    if (schema) {
      const result = schema.safeParse(body)
      if (!result.success) {
        throw new APIError(`Invalid request body: ${result.error.message}`, 400, "INVALID_BODY")
      }
      return result.data
    }

    return body
  } catch (error) {
    if (error instanceof APIError) throw error
    throw new APIError("Invalid JSON body", 400, "INVALID_JSON")
  }
}
