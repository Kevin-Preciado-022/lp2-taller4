'use client'

import { ThemeProvider } from 'next-themes'
import { SWRConfig } from 'swr'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'
import { ApiError } from '@/lib/api-error'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          shouldRetryOnError: (err) => !(err instanceof ApiError && err.status >= 400 && err.status < 500),
          errorRetryCount: 2,
        }}
      >
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="bottom-right" richColors theme="dark" />
          </CartProvider>
        </AuthProvider>
      </SWRConfig>
    </ThemeProvider>
  )
}
