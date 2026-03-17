// app/products/page.tsx
import { Suspense } from 'react';
import { getProducts } from '@/lib/actions';
import ProductsClient from './ProductsClient';
import { ProductCardSkeleton } from '@/components/products/ProductCard';

export const metadata = { title: 'Products' };
export const revalidate = 60;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; sort?: string; minPrice?: string; maxPrice?: string };
}) {
  const products = await getProducts({
    category: searchParams.category as any,
    search: searchParams.search,
    sortBy: searchParams.sort as any,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
  }).catch(() => []);

  return (
    <Suspense fallback={
      <div className="container-custom py-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    }>
      <ProductsClient initialProducts={products} searchParams={searchParams} />
    </Suspense>
  );
}
