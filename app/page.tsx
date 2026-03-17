// app/page.tsx
import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ExportCTA from '@/components/home/ExportCTA';
import StatsSection from '@/components/home/StatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BrandsSection from '@/components/home/BrandsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { getFeaturedProducts } from '@/lib/actions';
import { ProductCardSkeleton } from '@/components/products/ProductCard';

export const revalidate = 3600;

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts().catch(() => []);

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <Suspense fallback={
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          </div>
        </section>
      }>
        <FeaturedProducts products={featuredProducts} />
      </Suspense>
      <ExportCTA />
      <TestimonialsSection />
      <BrandsSection />
      <NewsletterSection />
    </div>
  );
}
