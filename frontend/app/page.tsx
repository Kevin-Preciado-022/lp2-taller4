import { CartSheet } from '@/components/cart-sheet'
import { Hero } from '@/components/hero'
import { ProductCatalog } from '@/components/product-catalog'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProductCatalog />
      </main>
      <SiteFooter />
      <CartSheet />
    </>
  )
}
