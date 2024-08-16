import { ClerkProvider } from '@clerk/nextjs'
import ThemeRegistry from './ThemeRegistry'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClerkProvider>
        <ThemeRegistry>
          <body>{children}</body>
        </ThemeRegistry>
      </ClerkProvider>
    </html>
  )
}
