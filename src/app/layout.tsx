import type { Metadata } from 'next'
import { Fraunces, Inter_Tight } from 'next/font/google'
import './globals.css'
import PaperGrain from '@/components/PaperGrain'
import SmoothScroll from '@/components/SmoothScroll'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-editorial',
  weight: 'variable',
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-mono-sans',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Atlas — A Cartographic Review of Places That Have Never Existed',
  description: 'A digital exhibition. A quiet, cinematic atlas of imaginary territories.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${interTight.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <PaperGrain />
      </body>
    </html>
  )
}
