'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { formatPrice, productImage } from '@/lib/format'
import type { Product } from '@/lib/types'

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()

  function handleAdd() {
    add(product)
    toast.success(`${product.name} agregado al carrito`)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/40">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={productImage(product.id) || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-pretty font-medium leading-snug">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="font-display text-2xl font-bold tabular-nums">{formatPrice(product.price)}</span>
          <Button size="sm" onClick={handleAdd} aria-label={`Agregar ${product.name} al carrito`}>
            <Plus aria-hidden="true" />
            Agregar
          </Button>
        </div>
      </div>
    </article>
  )
}
