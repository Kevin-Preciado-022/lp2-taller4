'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { getErrorMessage } from '@/lib/api-error'
import { isMockMode } from '@/lib/api'

type Errors = Partial<Record<'email' | 'password' | 'form', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    const next: Errors = {}
    if (!EMAIL_RE.test(email)) next.email = 'Ingresa un correo válido.'
    if (password.length < 6) next.password = 'La contraseña debe tener al menos 6 caracteres.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setIsSubmitting(true)
    try {
      const user = await login({ email, password })
      toast.success(`Bienvenido, ${user.name}`)
      router.push(user.role === 'admin' ? '/admin/productos/nuevo' : '/')
    } catch (err) {
      const message = getErrorMessage(err)
      setErrors({ form: message })
      toast.error('No se pudo iniciar sesión', { description: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <Field data-invalid={!!errors.email || undefined}>
          <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            aria-invalid={!!errors.email}
            required
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.password || undefined}>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            required
          />
          {errors.password && <FieldError>{errors.password}</FieldError>}
        </Field>
      </FieldGroup>

      {errors.form && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors.form}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
        {isSubmitting ? 'Ingresando…' : 'Ingresar'}
      </Button>

      {isMockMode && (
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Modo demo: usa cualquier correo que empiece con <span className="font-mono text-foreground">admin</span>{' '}
          para entrar como administrador.
        </p>
      )}
    </form>
  )
}
