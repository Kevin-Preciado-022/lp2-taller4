import Image from 'next/image'
import { ArrowDown, ShieldCheck, Truck, Zap } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

const perks = [
  { icon: Truck, label: 'Envío gratis desde $60' },
  { icon: ShieldCheck, label: 'Productos certificados' },
  { icon: Zap, label: 'Despacho en 24 h' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <Image
        src="/images/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-20 sm:px-6 md:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Nutrición deportiva</p>
        <h1 className="max-w-2xl text-balance font-display text-5xl font-extrabold uppercase leading-[0.95] md:text-7xl">
          Combustible para tu mejor versión
        </h1>
        <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
          Proteínas, creatina, pre-entrenos y vitaminas seleccionados para que entrenes más fuerte y te recuperes
          mejor.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a href="#catalogo" className={buttonVariants({ size: 'lg' })}>
            Ver catálogo
            <ArrowDown aria-hidden="true" />
          </a>
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          {perks.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="size-4 text-primary" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
