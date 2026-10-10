'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dumbbell, LogOut, Plus, ShoppingBag, User } from 'lucide-react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { user, isAdmin, isReady, logout } = useAuth()
  const { count, setOpen } = useCart()
  const router = useRouter()

  function handleLogout() {
    logout()
    toast.success('Sesión cerrada')
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="IRONFUEL, inicio">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Dumbbell className="size-4" aria-hidden="true" />
          </span>
          <span className="font-display text-2xl font-extrabold uppercase tracking-wide">Ironfuel</span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Principal">
          {isReady && isAdmin && (
            <Link
              href="/admin/productos/nuevo"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'hidden sm:inline-flex')}
            >
              <Plus aria-hidden="true" />
              Nuevo producto
            </Link>
          )}

          {isReady &&
            (user ? (
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 text-sm text-muted-foreground md:flex">
                  <User className="size-4" aria-hidden="true" />
                  {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut aria-hidden="true" />
                  <span className="hidden sm:inline">Salir</span>
                </Button>
              </div>
            ) : (
              <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                <User aria-hidden="true" />
                Ingresar
              </Link>
            ))}

          <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="relative">
            <ShoppingBag aria-hidden="true" />
            <span className="sr-only">Abrir carrito</span>
            <span aria-live="polite" className="tabular-nums">
              {count}
            </span>
          </Button>
        </nav>
      </div>
    </header>
  )
}
