import type { Metadata } from 'next'
import { Bai_Jamjuree as BaiJamjuree, Roboto_Flex as Roboto } from 'next/font/google'
import { cookies } from 'next/headers'
import type { ReactNode } from 'react'

import { Copyright } from '@/components/copyright'
import { Hero } from '@/components/hero'
import { Profile } from '@/components/profile'
import { SignIn } from '@/components/sign-in'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
})

const baiJamjuree = BaiJamjuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bai-jamjuree',
})

export const metadata: Metadata = {
  title: 'Spacetime',
  description: 'Uma cápsula do tempo construída com React, Next.js, TailwindCSS e TypeScript.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const isAuthenticated = cookies().has('token')

  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${baiJamjuree.variable} font-sans text-gray-100 bg-gray-900`}
      >
        <main className="grid grid-cols-2 min-h-screen">
          <div className="flex flex-col items-start justify-between px-28 py-16 relative overflow-hidden border-r border-white/10 bg-[url(../assets/bg-stars.svg)] bg-cover">
            <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-700 opacity-50 blur-full" />
            <div className="absolute right-2 top-0 bottom-0 w-2 bg-stripes" />

            {isAuthenticated ? <Profile /> : <SignIn />}
            <Hero />
            <Copyright />
          </div>

          <div className="flex flex-col p-16 bg-[url(../assets/bg-stars.svg)] bg-cover">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
