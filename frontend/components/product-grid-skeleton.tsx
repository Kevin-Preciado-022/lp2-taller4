import { Skeleton } from '@/components/ui/skeleton'

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-label="Cargando productos">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-border bg-card">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <div className="flex items-center justify-between pt-3">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
