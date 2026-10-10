'use client'

import { useDeferredValue, useState } from 'react'
import useSWR from 'swr'
import { toast } from 'sonner'
import { AlertTriangle, ChevronLeft, ChevronRight, PackageSearch, RotateCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductCard } from '@/components/product-card'
import { ProductGridSkeleton } from '@/components/product-grid-skeleton'
import { api } from '@/lib/api'
import { getErrorMessage } from '@/lib/api-error'

const PAGE_SIZE = 8

export function ProductCatalog() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const deferredSearch = useDeferredValue(search.trim())

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ['products', page, deferredSearch],
    () => api.products.list({ page, limit: PAGE_SIZE, search: deferredSearch }),
    {
      keepPreviousData: true,
      onError: (err) => toast.error('No se pudieron cargar los productos', { description: getErrorMessage(err) }),
    },
  )

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  return (
    <section id="catalogo" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-4xl font-extrabold uppercase">Catálogo</h2>
          <p className="mt-1 text-muted-foreground" aria-live="polite">
            {data ? `${data.total} productos disponibles` : 'Cargando productos…'}
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="product-search" className="sr-only">
            Buscar productos
          </label>
          <Input
            id="product-search"
            type="search"
            placeholder="Buscar proteína, creatina…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="h-10 pl-9"
            maxLength={80}
          />
        </div>
      </div>

      {isLoading && !data ? (
        <ProductGridSkeleton count={PAGE_SIZE} />
      ) : error && !data ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-destructive/40 bg-destructive/10 px-6 py-16 text-center">
          <AlertTriangle className="size-8 text-destructive" aria-hidden="true" />
          <div>
            <p className="font-medium">No pudimos cargar el catálogo</p>
            <p className="mt-1 text-sm text-muted-foreground">{getErrorMessage(error)}</p>
          </div>
          <Button variant="outline" onClick={() => mutate()}>
            <RotateCw aria-hidden="true" />
            Reintentar
          </Button>
        </div>
      ) : data && data.data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <PackageSearch className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="font-medium">Sin resultados</p>
          <p className="text-sm text-muted-foreground">
            {'No encontramos productos para "'}
            {deferredSearch}
            {'".'}
          </p>
        </div>
      ) : (
        <div className={isValidating ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data?.data.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      )}

      {data && data.total > PAGE_SIZE && (
        <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Paginación">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <ChevronLeft aria-hidden="true" />
            Anterior
          </Button>
          <span className="text-sm tabular-nums text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Siguiente
            <ChevronRight aria-hidden="true" />
          </Button>
        </nav>
      )}
    </section>
  )
}
