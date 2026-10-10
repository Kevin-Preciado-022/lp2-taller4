'use client'

import Image from 'next/image'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart-context'
import { formatPrice, productImage } from '@/lib/format'

export function CartSheet() {
  const { items, subtotal, isOpen, setOpen, updateQuantity, remove, clear } = useCart()

  function handleCheckout() {
    toast.success('Pedido registrado', { description: 'Te contactaremos para confirmar el pago y envío.' })
    clear()
    setOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl font-bold uppercase">Tu carrito</SheetTitle>
          <SheetDescription>Revisa tus productos antes de finalizar.</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-muted-foreground">Tu carrito está vacío.</p>
          </div>
        ) : (
          <ul className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-3 border-b border-border pb-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image src={productImage(product.id) || '/placeholder.svg'} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{product.name}</p>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(product.id)}
                      aria-label={`Eliminar ${product.name}`}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Disminuir cantidad"
                      >
                        <Minus aria-hidden="true" />
                      </Button>
                      <span className="w-8 text-center text-sm tabular-nums" aria-label={`Cantidad ${quantity}`}>
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus aria-hidden="true" />
                      </Button>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{formatPrice(product.price * quantity)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <SheetFooter className="border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-display text-2xl font-bold tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <Button size="lg" onClick={handleCheckout}>
              Finalizar pedido
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
