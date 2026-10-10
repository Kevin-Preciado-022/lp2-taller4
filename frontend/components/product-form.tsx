'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSWRConfig } from 'swr'
import { Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/api'
import { ApiError, getErrorMessage } from '@/lib/api-error'
import { useAuth } from '@/lib/auth-context'

type Errors = Partial<Record<'name' | 'price' | 'description' | 'form', string>>

export function ProductForm() {
  const { isReady, isAdmin, user, logout } = useAuth()
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isReady) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <Lock className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-muted-foreground">
          {user ? 'Tu cuenta no tiene permisos de administrador.' : 'Inicia sesión como administrador para continuar.'}
        </p>
        <Link href="/login" className={buttonVariants()}>
          Ir a iniciar sesión
        </Link>
      </div>
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formEl = event.currentTarget
    const form = new FormData(formEl)
    const name = String(form.get('name') ?? '').trim()
    const priceRaw = String(form.get('price') ?? '').trim()
    const description = String(form.get('description') ?? '').trim()
    const price = Number(priceRaw)

    const next: Errors = {}
    if (name.length < 2) next.name = 'El nombre debe tener al menos 2 caracteres.'
    else if (name.length > 120) next.name = 'Máximo 120 caracteres.'
    if (!priceRaw || !Number.isFinite(price) || price <= 0) next.price = 'Ingresa un precio mayor a 0.'
    else if (price > 100000) next.price = 'El precio es demasiado alto.'
    if (description.length > 1000) next.description = 'Máximo 1000 caracteres.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setIsSubmitting(true)
    try {
      const product = await api.products.create({ name, price: Math.round(price * 100) / 100, description })
      await mutate((key) => Array.isArray(key) && key[0] === 'products')
      toast.success('Producto creado', { description: product.name })
      formEl.reset()
      router.push('/#catalogo')
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout()
        toast.error('Tu sesión expiró. Vuelve a iniciar sesión.')
        router.push('/login')
        return
      }
      const message = getErrorMessage(err)
      setErrors({ form: message })
      toast.error('No se pudo crear el producto', { description: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <Field data-invalid={!!errors.name || undefined}>
          <FieldLabel htmlFor="name">Nombre</FieldLabel>
          <Input id="name" name="name" placeholder="Whey Protein Isolate 2 lb" maxLength={120} aria-invalid={!!errors.name} />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.price || undefined}>
          <FieldLabel htmlFor="price">Precio (USD)</FieldLabel>
          <Input
            id="price"
            name="price"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            placeholder="49.90"
            aria-invalid={!!errors.price}
          />
          {errors.price && <FieldError>{errors.price}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.description || undefined}>
          <FieldLabel htmlFor="description">Descripción</FieldLabel>
          <Textarea
            id="description"
            name="description"
            rows={4}
            maxLength={1000}
            placeholder="Sabor, tamaño, porciones, beneficios…"
            aria-invalid={!!errors.description}
          />
          {errors.description ? (
            <FieldError>{errors.description}</FieldError>
          ) : (
            <FieldDescription>Opcional. Máximo 1000 caracteres.</FieldDescription>
          )}
        </Field>
      </FieldGroup>

      {errors.form && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors.form}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href="/" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
          Cancelar
        </Link>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
          {isSubmitting ? 'Guardando…' : 'Crear producto'}
        </Button>
      </div>
    </form>
  )
}
