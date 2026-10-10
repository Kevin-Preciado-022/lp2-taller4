import { isMockMode } from '@/lib/api'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>{`© ${new Date().getFullYear()} Ironfuel. Suplementos deportivos.`}</p>
        {isMockMode && <p className="text-xs">Modo demo: datos simulados (sin backend conectado).</p>}
      </div>
    </footer>
  )
}
