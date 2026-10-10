import type { Metadata } from 'next'
import { LoginForm } from '@/components/login-form'
import { SiteHeader } from '@/components/site-header'
import { CartSheet } from '@/components/cart-sheet'

export const metadata: Metadata = {
  title: 'Ingresar | IRONFUEL',
}

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <h1 className="font-display text-4xl font-extrabold uppercase">Ingresar</h1>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">Accede a tu cuenta para gestionar tus pedidos.</p>
          <LoginForm />
        </div>
      </main>
      <CartSheet />
    </>
  )
}
