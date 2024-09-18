import { register } from "@/services/api"

export async function POST(request: Request) {
    const body = await request.json()
    const response = await register(body)
    return Response.json({})
}