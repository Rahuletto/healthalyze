import {
  ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Healthalyze',
  description: 'Check your stroke probability and get suggestions',
  icons: './icon.svg',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}