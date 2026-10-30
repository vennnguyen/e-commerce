import { auth } from "@/lib/auth/auth"

import { headers } from "next/headers"
import { NextRequest } from "next/server"
import { URL } from "url"

const FORWARD_HEADERS = [
    'accept',
    'content-type',
    'accept-language',
]

async function getSessionToken(): Promise<string> {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        return session?.session?.token ?? ""
    } catch {
        return ""
    }
}

function buildNestUrl(path: string, request: NextRequest): URL {

}