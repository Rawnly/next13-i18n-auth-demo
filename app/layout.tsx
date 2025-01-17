import './globals.css'
import { Session } from 'next-auth'
import { DM_Sans } from '@next/font/google'

import AuthProvider from './AuthProvider'
import { languages } from './i18n/settings'
import { useTranslation } from './i18n'

const dm_sans = DM_Sans({
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
  subsets: ['latin', 'latin-ext'],
})

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

type RootLayoutProps = {
  children: React.ReactNode,
  params: {
    lng: string
  }
}

async function getSession(cookie: string): Promise<Session | null> {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: { cookie },
  })

  if (!response?.ok) {
    return null
  }

  const session = await response.json()
  return Object.keys(session).length > 0 ? session : null
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const session = await getSession('next-auth.session-token')

  return (
    <html>
      <head />
      <body className={dm_sans.variable}>
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
