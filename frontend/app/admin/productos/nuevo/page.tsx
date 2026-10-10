import type { Metadata } from 'next'
import { CartSheet } from '@/components/cart-sheet'
import { ProductForm } from '@/components/product-form'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Nuevo producto | IRONFUEL',
  robots: { index: false },
}

export default function NewProductPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Administración</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold uppercase">Nuevo producto</h1>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">Agrega un suplemento al catálogo.</p>
          <ProductForm />
        </div>
      </main>
      <CartSheet />
    </>
  )
}
