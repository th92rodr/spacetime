import { type NextRequest, NextResponse } from 'next/server'

import { api } from '@/lib/api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  const response = await api.post('/register', { code })
  const { token } = response.data

  const redirectUrl = new URL('/', request.url)
  const cookieExpirationInSeconds = 60 * 60 * 24 * 30 // 1 month

  return NextResponse.redirect(redirectUrl, {
    headers: {
      'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpirationInSeconds};`,
    },
  })
}
