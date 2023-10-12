import './globals.css'
import type { Metadata } from 'next'
import { Montserrat_Alternates} from 'next/font/google'

const montserratAlternates = Montserrat_Alternates({
  subsets: ['latin'],
  weight: '100'
})

export const metadata: Metadata = {
  title: 'Chase io',
  description: 'Gome gu de gurioso',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={montserratAlternates.className}>{children}</body>
    </html>
  )
}
